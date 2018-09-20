using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.Rest;
using PowerBIEmbedded_AppOwnsData.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PowerBIEmbedded_AppOwnsData.Controllers
{
    public class HomeController : Controller
    {
        private static readonly string Username = ConfigurationManager.AppSettings["pbiUsername"];
        private static readonly string Password = ConfigurationManager.AppSettings["pbiPassword"];
        private static readonly string AuthorityUrl = ConfigurationManager.AppSettings["authorityUrl"];
        private static readonly string ResourceUrl = ConfigurationManager.AppSettings["resourceUrl"];
        private static readonly string ApplicationId = ConfigurationManager.AppSettings["ApplicationId"];
        private static readonly string ApplicationSecret = ConfigurationManager.AppSettings["ApplicationSecret"];
        private static readonly string ApiUrl = ConfigurationManager.AppSettings["apiUrl"];
        private static string WorkspaceId = ConfigurationManager.AppSettings["workspaceId"];
        private static string ReportId = ConfigurationManager.AppSettings["reportId"];

        public ActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> EmbedReportWV2()
        {
            var result = new EmbedConfig();
            string newFolderName = string.Concat("Folder-", Guid.NewGuid());
            var error = GetWebConfigErrors();
            if (error != null)
            {
                return View(new EmbedConfig()
                {
                    ErrorMessage = error
                });
            }

            // Authenticate using created credentials
            var authenticationContext = new AuthenticationContext(AuthorityUrl);
            AuthenticationResult authenticationResult = null;
            if (string.IsNullOrEmpty(ApplicationSecret))
            {
                return View("Available for apps only");
            }
            else
            {
                ClientCredential clientCredential = new ClientCredential(ApplicationId, ApplicationSecret);
                authenticationResult = await authenticationContext.AcquireTokenAsync(ResourceUrl, clientCredential);
            }

            if (authenticationResult == null)
            {
                return View("Authentication Failed.");
            }

            var tokenCredentials = new TokenCredentials(authenticationResult.AccessToken, "Bearer");

            // Create a Power BI Client object. It will be used to call Power BI APIs.
            using (var client = new PowerBIClient(new Uri(ApiUrl), tokenCredentials))
            {
                var folder = await client.Groups.CreateGroupAsync(new GroupCreationRequest() { Name = newFolderName });
                WorkspaceId = folder.Id;
                var sampleLocation = Path.Combine(AppDomain.CurrentDomain.BaseDirectory.ToString(), "Samples", "Contoso Sales Sample for Power BI Desktop.pbix");
                var sampleName = "contosoSales";
                using (var stream = System.IO.File.OpenRead(sampleLocation))
                {
                    var import = await client.Imports.PostImportWithFileAsyncInGroup(WorkspaceId, stream, sampleName);
                    while (import.ImportState != "Succeeded" && import.ImportState != "Failed")
                    {
                        Thread.Sleep(1000);
                        import = await client.Imports.GetImportByIdInGroupAsync(WorkspaceId, import.Id);
                    }
                    ReportId = import.Reports[0].Id;
                    result = await _EmbedReport(null, null);
                }
            }

            return View(result);
        }

        public async Task<ActionResult> EmbedReport(string username, string roles)
        {
            var result = await _EmbedReport(username, roles);
            return View(result);
        }

        public async Task<ActionResult> EmbedDashboard()
        {
            var error = GetWebConfigErrors();
            if (error != null)
            {
                return View(new EmbedConfig()
                {
                    ErrorMessage = error
                });
            }

            // Create a user password cradentials.
            var credential = new UserPasswordCredential(Username, Password);

            // Authenticate using created credentials
            var authenticationContext = new AuthenticationContext(AuthorityUrl);
            var authenticationResult = await authenticationContext.AcquireTokenAsync(ResourceUrl, ApplicationId, credential);

            if (authenticationResult == null)
            {
                return View(new EmbedConfig()
                {
                    ErrorMessage = "Authentication Failed."
                });
            }

            var tokenCredentials = new TokenCredentials(authenticationResult.AccessToken, "Bearer");

            // Create a Power BI Client object. It will be used to call Power BI APIs.
            using (var client = new PowerBIClient(new Uri(ApiUrl), tokenCredentials))
            {
                // Get a list of dashboards.
                var dashboards = await client.Dashboards.GetDashboardsInGroupAsync(WorkspaceId);

                // Get the first report in the workspace.
                var dashboard = dashboards.Value.FirstOrDefault();

                if (dashboard == null)
                {
                    return View(new EmbedConfig()
                    {
                        ErrorMessage = "Workspace has no dashboards."
                    });
                }

                // Generate Embed Token.
                var generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
                var tokenResponse = await client.Dashboards.GenerateTokenInGroupAsync(WorkspaceId, dashboard.Id, generateTokenRequestParameters);

                if (tokenResponse == null)
                {
                    return View(new EmbedConfig()
                    {
                        ErrorMessage = "Failed to generate embed token."
                    });
                }

                // Generate Embed Configuration.
                var embedConfig = new EmbedConfig()
                {
                    EmbedToken = tokenResponse,
                    EmbedUrl = dashboard.EmbedUrl,
                    Id = dashboard.Id
                };

                return View(embedConfig);
            }
        }

        public async Task<ActionResult> EmbedTile()
        {
            var error = GetWebConfigErrors();
            if (error != null)
            {
                return View(new TileEmbedConfig()
                {
                    ErrorMessage = error
                });
            }

            // Create a user password cradentials.
            var credential = new UserPasswordCredential(Username, Password);

            // Authenticate using created credentials
            var authenticationContext = new AuthenticationContext(AuthorityUrl);
            var authenticationResult = await authenticationContext.AcquireTokenAsync(ResourceUrl, ApplicationId, credential);

            if (authenticationResult == null)
            {
                return View(new TileEmbedConfig()
                {
                    ErrorMessage = "Authentication Failed."
                });
            }

            var tokenCredentials = new TokenCredentials(authenticationResult.AccessToken, "Bearer");

            // Create a Power BI Client object. It will be used to call Power BI APIs.
            using (var client = new PowerBIClient(new Uri(ApiUrl), tokenCredentials))
            {
                // Get a list of dashboards.
                var dashboards = await client.Dashboards.GetDashboardsInGroupAsync(WorkspaceId);

                // Get the first report in the workspace.
                var dashboard = dashboards.Value.FirstOrDefault();

                if (dashboard == null)
                {
                    return View(new TileEmbedConfig()
                    {
                        ErrorMessage = "Workspace has no dashboards."
                    });
                }

                var tiles = await client.Dashboards.GetTilesInGroupAsync(WorkspaceId, dashboard.Id);

                // Get the first tile in the workspace.
                var tile = tiles.Value.FirstOrDefault();

                // Generate Embed Token for a tile.
                var generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
                var tokenResponse = await client.Tiles.GenerateTokenInGroupAsync(WorkspaceId, dashboard.Id, tile.Id, generateTokenRequestParameters);

                if (tokenResponse == null)
                {
                    return View(new TileEmbedConfig()
                    {
                        ErrorMessage = "Failed to generate embed token."
                    });
                }

                // Generate Embed Configuration.
                var embedConfig = new TileEmbedConfig()
                {
                    EmbedToken = tokenResponse,
                    EmbedUrl = tile.EmbedUrl,
                    Id = tile.Id,
                    dashboardId = dashboard.Id
                };

                return View(embedConfig);
            }
        }

        private async Task<EmbedConfig> _EmbedReport(string username, string roles)
        {
            var result = new EmbedConfig();
            try
            {
                result = new EmbedConfig { Username = username, Roles = roles };
                var error = GetWebConfigErrors();
                if (error != null)
                {
                    result.ErrorMessage = error;
                    return result;
                }

                // Authenticate using created credentials
                var authenticationContext = new AuthenticationContext(AuthorityUrl);
                AuthenticationResult authenticationResult = null;
                if (string.IsNullOrEmpty(ApplicationSecret))
                {
                    var credential = new UserPasswordCredential(Username, Password);
                    authenticationResult = await authenticationContext.AcquireTokenAsync(ResourceUrl, ApplicationId, credential);
                }
                else
                {

                    ClientCredential clientCredential = new ClientCredential(ApplicationId, ApplicationSecret);
                    authenticationResult = await authenticationContext.AcquireTokenAsync(ResourceUrl, clientCredential);
                }

                if (authenticationResult == null)
                {
                    result.ErrorMessage = "Authentication Failed.";
                    return result;
                }

                var tokenCredentials = new TokenCredentials(authenticationResult.AccessToken, "Bearer");

                // Create a Power BI Client object. It will be used to call Power BI APIs.
                using (var client = new PowerBIClient(new Uri(ApiUrl), tokenCredentials))
                {

                    // Get a list of reports.
                    var reports = await client.Reports.GetReportsInGroupAsync(WorkspaceId);

                    // No reports retrieved for the given workspace.
                    if (reports.Value.Count() == 0)
                    {
                        result.ErrorMessage = "No reports were found in the workspace";
                        return result;
                    }

                    Report report;
                    if (string.IsNullOrWhiteSpace(ReportId))
                    {
                        // Get the first report in the workspace.
                        report = reports.Value.FirstOrDefault();
                    }
                    else
                    {
                        report = reports.Value.FirstOrDefault(r => r.Id.Equals(ReportId, StringComparison.InvariantCultureIgnoreCase));
                    }

                    if (report == null)
                    {
                        result.ErrorMessage = "No report with the given ID was found in the workspace. Make sure ReportId is valid.";
                        return result;
                    }

                    var datasets = await client.Datasets.GetDatasetByIdInGroupAsync(WorkspaceId, report.DatasetId);
                    result.IsEffectiveIdentityRequired = datasets.IsEffectiveIdentityRequired;
                    result.IsEffectiveIdentityRolesRequired = datasets.IsEffectiveIdentityRolesRequired;
                    GenerateTokenRequest generateTokenRequestParameters;
                    // This is how you create embed token with effective identities
                    if (!string.IsNullOrWhiteSpace(username))
                    {
                        var rls = new EffectiveIdentity(username, new List<string> { report.DatasetId });
                        if (!string.IsNullOrWhiteSpace(roles))
                        {
                            var rolesList = new List<string>();
                            rolesList.AddRange(roles.Split(','));
                            rls.Roles = rolesList;
                        }
                        // Generate Embed Token with effective identities.
                        generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view", identities: new List<EffectiveIdentity> { rls });
                    }
                    else
                    {
                        // Generate Embed Token for reports without effective identities.
                        generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
                    }

                    var tokenResponse = await client.Reports.GenerateTokenInGroupAsync(WorkspaceId, report.Id, generateTokenRequestParameters);

                    if (tokenResponse == null)
                    {
                        result.ErrorMessage = "Failed to generate embed token.";
                        return result;
                    }

                    // Generate Embed Configuration.
                    result.EmbedToken = tokenResponse;
                    result.EmbedUrl = report.EmbedUrl;
                    result.Id = report.Id;

                    return result;
                }
            }
            catch (HttpOperationException exc)
            {
                result.ErrorMessage = string.Format("Status: {0} ({1})\r\nResponse: {2}\r\nRequestId: {3}", exc.Response.StatusCode, (int)exc.Response.StatusCode, exc.Response.Content, exc.Response.Headers["RequestId"].FirstOrDefault());
            }
            catch (Exception exc)
            {
                result.ErrorMessage = exc.ToString();
            }

            return result;
        }

        /// <summary>
        /// Check if web.config embed parameters have valid values.
        /// </summary>
        /// <returns>Null if web.config parameters are valid, otherwise returns specific error string.</returns>
        private string GetWebConfigErrors()
        {
            // Application Id must have a value.
            if (string.IsNullOrWhiteSpace(ApplicationId))
            {
                return "ApplicationId is empty. please register your application as Native app in https://dev.powerbi.com/apps and fill client Id in web.config.";
            }

            // Application Id must be a Guid object.
            Guid result;
            if (!Guid.TryParse(ApplicationId, out result))
            {
                return "ApplicationId must be a Guid object. please register your application as Native app in https://dev.powerbi.com/apps and fill application Id in web.config.";
            }


            return null;
        }
    }
}
