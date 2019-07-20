using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

namespace PowerBI_API_NetCore_Sample
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var appSettings = Configuration.GetSection("AppSettings").Get<AppSettings>();
            services.AddSingleton(appSettings);

            services
                .AddAuthentication(options =>
                {
                    options.DefaultScheme = "Cookies";
                    options.DefaultChallengeScheme = "AzureAD";
                })
                .AddCookie("Cookies")
                .AddOpenIdConnect("AzureAD", options =>
                {
                    // Specify we want the user to be redirect to Azure AD to authenticate themselves
                    options.Authority = appSettings.AuthorityUri;

                    // Client ID is used by the application to identify themselves to the users that they are requesting permissions from.
                    // You get the client id when you register your Azure app
                    options.ClientId = appSettings.ApplicationId;

                    // Azure AD will return an authorization code.
                    options.ResponseType = OpenIdConnectResponseType.Code;

                    // After app authenticates, Azure AD will redirect back to the web app. In this sample, Azure AD redirects back
                    // to Default page, which is the root of the application (/)
                    options.CallbackPath = new PathString("/");

                    // Indicate we want to save the access token in the session cookie
                    options.SaveTokens = true;

                    // Disable issuer validation as we can't know in advance which Azure AD tenant
                    // the user will log in with
                    options.TokenValidationParameters.ValidateIssuer = false;

                    // The root of the application, /, has 2 purposes:
                    //  - serve the default page by MVC, Index.cshtml; and
                    //  - process the data returned by Azure AD after the user authenticates (this is set when configuring the Azure app)
                    //
                    // Because of that, we need to indicate to the OpenID Connect handler that not all requests will contain an OpenID Connect message
                    options.SkipUnrecognizedRequests = true;

                    // SkipUnrecognizedRequests doesn't behave correctly in ASP.NET Core 2.x
                    // Fixed in ASP.NET Core 3.x
                    // See https://github.com/aspnet/AspNetCore/pull/10060
                    options.Events.OnMessageReceived = context =>
                    {
                        if (context.Properties.Items.Count == 0)
                        {
                            context.SkipHandler();
                        }

                        return Task.CompletedTask;
                    };

                    options.Events.OnRedirectToIdentityProvider = context =>
                    {
                        // Before the user is redirected to Azure AD, indicate what resource we're interested in accessing
                        // Resource uri to the Power BI resource to be authorized
                        // The resource uri is hard-coded for sample purposes
                        context.ProtocolMessage.Resource = appSettings.ResourceUrl;
                        return Task.CompletedTask;
                    };
                });

            services.AddMvc(options =>
            {
                // Use MVC global filters to indicate every single request must be authenticated
                // This is what will redirect users to Azure AD on their first request
                var requireAuthenticatedUsersPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();

                options.Filters.Add(new AuthorizeFilter(requireAuthenticatedUsersPolicy));
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseMvc();
        }
    }
}
