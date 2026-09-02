// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace EncryptCredentials.Tests
{
    using EncryptCredentials.Controllers;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Testing;
    using Microsoft.AspNetCore.TestHost;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Security.Claims;
    using System.Text.Encodings.Web;
    using System.Threading.Tasks;
    using Xunit;

    public class AuthorizationTests : IClassFixture<DatasourceWebApplicationFactory>
    {
        private readonly DatasourceWebApplicationFactory factory;

        public AuthorizationTests(DatasourceWebApplicationFactory factory)
        {
            this.factory = factory;
        }

        public static IEnumerable<object[]> PrivilegedEndpoints()
        {
            yield return new object[] { HttpMethod.Get, "/encryptcredential/getdatasourcesingroup" };
            yield return new object[] { HttpMethod.Post, "/encryptcredential/updatedatasource" };
            yield return new object[] { HttpMethod.Post, "/encryptcredential/adddatasource" };
            yield return new object[] { HttpMethod.Post, "/encryptcredential/encrypt" };
        }

        [Theory]
        [MemberData(nameof(PrivilegedEndpoints))]
        public async Task AnonymousRequestsAreRejected(HttpMethod method, string path)
        {
            using var request = new HttpRequestMessage(method, path);
            using var response = await factory.CreateClient().SendAsync(request);

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task UserWithoutDatasourceAdministratorRoleIsForbidden()
        {
            using var request = new HttpRequestMessage(HttpMethod.Get, "/encryptcredential/getdatasourcesingroup");
            request.Headers.Authorization = new AuthenticationHeaderValue("Test", "user");

            using var response = await factory.CreateClient().SendAsync(request);

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }

        [Fact]
        public async Task AnonymousApiChallengeDoesNotContactIdentityProvider()
        {
            using var identityProviderUnavailableFactory = new UnavailableIdentityProviderFactory();
            using var client = identityProviderUnavailableFactory.CreateClient(
                new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

            using var response = await client.GetAsync("/encryptcredential/getdatasourcesingroup");

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task AdministratorPostWithoutAntiforgeryTokenIsRejected()
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, "/encryptcredential/adddatasource");
            request.Headers.Authorization = new AuthenticationHeaderValue("Test", Startup.DatasourceAdministratorRole);
            request.Content = new FormUrlEncodedContent(new Dictionary<string, string>());

            using var response = await factory.CreateClient().SendAsync(request);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public void DatasourceControllerRequiresAdministratorPolicy()
        {
            var authorize = typeof(EncryptCredentialsController)
                .GetCustomAttributes(typeof(AuthorizeAttribute), true)
                .Cast<AuthorizeAttribute>()
                .Single();

            Assert.Equal(Startup.DatasourceAdministratorPolicy, authorize.Policy);
            Assert.NotEmpty(typeof(EncryptCredentialsController)
                .GetCustomAttributes(typeof(AutoValidateAntiforgeryTokenAttribute), true));
        }
    }

    public class UnavailableIdentityProviderFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((context, configuration) =>
            {
                configuration.AddInMemoryCollection(new Dictionary<string, string>
                {
                    ["OperatorAzureAd:Instance"] = "https://127.0.0.1:1/",
                    ["OperatorAzureAd:TenantId"] = "00000000-0000-0000-0000-000000000000",
                    ["OperatorAzureAd:ClientId"] = "00000000-0000-0000-0000-000000000000",
                    ["OperatorAzureAd:ClientSecret"] = "test-secret",
                    ["OperatorAzureAd:CallbackPath"] = "/signin-oidc"
                });
            });
        }
    }

    public class DatasourceWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((context, configuration) =>
            {
                configuration.AddInMemoryCollection(new Dictionary<string, string>
                {
                    ["OperatorAzureAd:Instance"] = "https://login.microsoftonline.com/",
                    ["OperatorAzureAd:TenantId"] = "00000000-0000-0000-0000-000000000000",
                    ["OperatorAzureAd:ClientId"] = "00000000-0000-0000-0000-000000000000",
                    ["OperatorAzureAd:ClientSecret"] = "test-secret",
                    ["OperatorAzureAd:CallbackPath"] = "/signin-oidc"
                });
            });

            builder.ConfigureTestServices(services =>
            {
                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = TestAuthenticationHandler.SchemeName;
                    options.DefaultChallengeScheme = TestAuthenticationHandler.SchemeName;
                    options.DefaultForbidScheme = TestAuthenticationHandler.SchemeName;
                    options.DefaultScheme = TestAuthenticationHandler.SchemeName;
                }).AddScheme<AuthenticationSchemeOptions, TestAuthenticationHandler>(
                    TestAuthenticationHandler.SchemeName,
                    options => { });
            });
        }
    }

    public class TestAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public const string SchemeName = "Test";

        public TestAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder)
            : base(options, logger, encoder)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.TryGetValue("Authorization", out var authorization))
            {
                return Task.FromResult(AuthenticateResult.NoResult());
            }

            var role = AuthenticationHeaderValue.Parse(authorization).Parameter;
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "test-user"),
                new Claim(ClaimTypes.Name, "Test User")
            };

            if (!string.IsNullOrWhiteSpace(role))
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, SchemeName));
            var ticket = new AuthenticationTicket(principal, SchemeName);
            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}
