using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.Rest;
using Newtonsoft.Json.Linq;

namespace PowerBI_API_NetCore_Sample.Pages
{
    public class IndexModel : PageModel
    {
        public static string _accessToken;
        public string EmbedUrl { get; set; }
        public string AccessToken { get; set; }
        public string ReportId { get; set; }

        public AppSettings AppSettings { get; }

        public IndexModel(IConfiguration configuration)
        {
            AppSettings = configuration.GetSection("AppSettings").Get<AppSettings>();
        }

        public void OnGet()
        {
            if (Request.Query.ContainsKey("code"))
            {
                if (_accessToken == null)
                {
                    var authCode = Request.Query["code"][0];
                    Task.Run(async () => await GetAccessToken(authCode)).Wait();
                    AccessToken = _accessToken;
                    Task.Run(async () => await EmbedReport()).Wait();
                }
                else
                {
                    // handle refresh in web page
                    AccessToken = _accessToken;
                    Task.Run(async () => await EmbedReport()).Wait();
                }
            }
            else
            {
                var errorMessage = VerifySettings();
                if (string.IsNullOrEmpty(errorMessage))
                {
                    GetAuthorizationCode();
                }
                else
                {
                    // error in settings
                    Response.Redirect($"Error?message={errorMessage}");
                }
            }
        }

        private async Task EmbedReport()
        {
            using (var client = new PowerBIClient(new Uri(AppSettings.ApiUrl), new TokenCredentials(AccessToken, "Bearer")))
            {
                string groupId;

                if (string.IsNullOrEmpty(AppSettings.GroupId))
                {
                    // getting first group in GetGroups results
                    groupId = (await client.Groups.GetGroupsAsync()).Value.FirstOrDefault()?.Id;
                }
                else
                {
                    groupId = AppSettings.GroupId;
                }

                if (string.IsNullOrEmpty(groupId))
                {
                    // no groups available for user
                    string message = "No group available, need to create a group and upload a report";
                    Response.Redirect($"Error?message={message}");
                }

                // getting first report in selected group from GetReports results
                Report report = (await client.Reports.GetReportsInGroupAsync(groupId)).Value.FirstOrDefault();

                if (report != null)
                {
                    EmbedUrl = report.EmbedUrl;
                    ReportId = report.Id;
                }
                else
                {
                    // no reports available for user in chosen group
                    // need to upload a report or insert a specific group id in appsettings.json
                    string message = "No report available in workspace with ID " + groupId + ", Please fill a group id with existing report in appsettings.json file";
                    Response.Redirect($"Error?message={message}");
                }
            }
        }

        private void GetAuthorizationCode()
        {
            var queryParams = new NameValueCollection
            {
                // Azure AD will return an authorization code. 
                {"response_type", "code"},

                // Client ID is used by the application to identify themselves to the users that they are requesting permissions from. 
                // You get the client id when you register your Azure app.
                {"client_id", AppSettings.ApplicationId},

                // Resource uri to the Power BI resource to be authorized
                // The resource uri is hard-coded for sample purposes
                {"resource", AppSettings.ResourceUrl},

                // After app authenticates, Azure AD will redirect back to the web app. In this sample, Azure AD redirects back
                // to Default page (Default.aspx).
                { "redirect_uri", AppSettings.RedirectUrl}
            };

            // Create sign-in query string
            var queryString = HttpUtility.ParseQueryString(string.Empty);
            queryString.Add(queryParams);

            // Redirect to Azure AD Authority
            //  Authority Uri is an Azure resource that takes a application id and application secret to get an Access token
            //  QueryString contains 
            //      response_type of "code"
            //      client_id that identifies your app in Azure AD
            //      resource which is the Power BI API resource to be authorized
            //      redirect_uri which is the uri that Azure AD will redirect back to after it authenticates

            // Redirect to Azure AD to get an authorization code
            Response.Redirect($"{AppSettings.AuthorityUri} ?{queryString}");
        }

        private async Task GetAccessToken(string authCode)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

                var authenticationCredentials = new Dictionary<string, string>
                {
                    { "client_id", AppSettings.ApplicationId },
                    { "client_secret", AppSettings.ApplicationSecret },
                    { "grant_type", "authorization_code" },
                    { "code", authCode },
                    { "redirect_uri", AppSettings.RedirectUrl },
                };
                
                using (var response = await httpClient.PostAsync(AppSettings.LoggingRequestUrl,
                    new FormUrlEncodedContent(authenticationCredentials)))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var result = JObject.Parse(await response.Content.ReadAsStringAsync());
                        _accessToken = result.Value<string>("access_token");
                    }
                    else
                    {
                        Response.Redirect("Error?message=Can't get access token");
                    }
                }
            }
        }

        private string VerifySettings()
        {
            string message = null;
            Guid result;

            // Application Id must have a value.
            if (string.IsNullOrWhiteSpace(AppSettings.ApplicationId))
            {
                message = "ApplicationId is empty. please register your application as Native app in https://dev.powerbi.com/apps and fill application Id in appsettings.json";
            }
            else
            {
                // Application Id must be a Guid object.
                if (!Guid.TryParse(AppSettings.ApplicationId, out result))
                {
                    message = "ApplicationId must be a Guid object. please register your application as Native app in https://dev.powerbi.com/apps and fill application Id in appsettings.json";
                }
            }

            // Workspace Id must be a Guid object.
            if (!string.IsNullOrWhiteSpace(AppSettings.GroupId))
            {
                if (!Guid.TryParse(AppSettings.GroupId, out result))
                {
                    message = "GroupId must be a Guid object. Please select a group you own and fill its Id in appsettings.json";
                }
            }

            // All urls must have value
            if (string.IsNullOrWhiteSpace(AppSettings.ApiUrl) || string.IsNullOrWhiteSpace(AppSettings.AuthorityUri) ||
                string.IsNullOrWhiteSpace(AppSettings.RedirectUrl) || string.IsNullOrWhiteSpace(AppSettings.ResourceUrl) || string.IsNullOrWhiteSpace(AppSettings.LoggingRequestUrl))
            {
                message = "One or more of the urls required are missing. Please check appsettings.json file. for more info check sample instructions in https://github.com/Microsoft/PowerBI-Developer-Samples";
            }

            return message;
        }
    }
}
