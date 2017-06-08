using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.Rest;
using PowerBIEmbedded_AppOwnsData.Models;
using System;
using System.Configuration;
using System.Linq;
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
        private static readonly string ClientId = ConfigurationManager.AppSettings["clientId"];
        private static readonly string ApiUrl = ConfigurationManager.AppSettings["apiUrl"];
        private static readonly string GroupId = ConfigurationManager.AppSettings["groupId"];

        public ActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> EmbedReport()
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
            var authenticationResult = await authenticationContext.AcquireTokenAsync(ResourceUrl, ClientId, credential);

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
                // Get a list of reports.
                var reports = await client.Reports.GetReportsInGroupAsync(GroupId);

                // Get the first report in the group.
                var report = reports.Value.FirstOrDefault();

                if (report == null)
                {
                    return View(new EmbedConfig()
                    {
                        ErrorMessage = "Group has no reports."
                    });
                }

                // Generate Embed Token.
                var generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
                var tokenResponse = await client.Reports.GenerateTokenInGroupAsync(GroupId, report.Id, generateTokenRequestParameters);

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
                    EmbedUrl = report.EmbedUrl,
                    Id = report.Id
                };

                return View(embedConfig);
            }
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
            var authenticationResult = await authenticationContext.AcquireTokenAsync(ResourceUrl, ClientId, credential);

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
                var dashboards = await client.Dashboards.GetDashboardsInGroupAsync(GroupId);

                // Get the first report in the group.
                var dashboard = dashboards.Value.FirstOrDefault();

                if (dashboard == null)
                {
                    return View(new EmbedConfig()
                    {
                        ErrorMessage = "Group has no dashboards."
                    });
                }

                // Generate Embed Token.
                var generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
                var tokenResponse = await client.Dashboards.GenerateTokenInGroupAsync(GroupId, dashboard.Id, generateTokenRequestParameters);

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
            var authenticationResult = await authenticationContext.AcquireTokenAsync(ResourceUrl, ClientId, credential);

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
                var dashboards = await client.Dashboards.GetDashboardsInGroupAsync(GroupId);

                // Get the first report in the group.
                var dashboard = dashboards.Value.FirstOrDefault();

                if (dashboard == null)
                {
                    return View(new TileEmbedConfig()
                    {
                        ErrorMessage = "Group has no dashboards."
                    });
                }

                var tiles = await client.Dashboards.GetTilesInGroupAsync(GroupId, dashboard.Id);

                // Get the first tile in the group.
                var tile = tiles.Value.FirstOrDefault();

                // Generate Embed Token for a tile.
                var generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
                var tokenResponse = await client.Tiles.GenerateTokenInGroupAsync(GroupId, dashboard.Id, tile.Id, generateTokenRequestParameters);

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

        /// <summary>
        /// Check if web.config embed parameters have valid values.
        /// </summary>
        /// <returns>Null if web.config parameters are valid, otherwise returns specific error string.</returns>
        private string GetWebConfigErrors()
        {
            // Client Id must have a value.
            if (string.IsNullOrEmpty(ClientId))
            {
                return "ClientId is empty. please register your application as Native app in https://dev.powerbi.com/apps and fill client Id in web.config.";
            }

            // Client Id must be a Guid object.
            Guid result;
            if (!Guid.TryParse(ClientId, out result))
            {
                return "ClientId must be a Guid object. please register your application as Native app in https://dev.powerbi.com/apps and fill client Id in web.config.";
            }

            // Group Id must have a value.
            if (string.IsNullOrEmpty(GroupId))
            {
                return "GroupId is empty. Please select a group you own and fill its Id in web.config";
            }

            // Group Id must be a Guid object.
            if (!Guid.TryParse(GroupId, out result))
            {
                return "GroupId must be a Guid object. Please select a group you own and fill its Id in web.config";
            }

            // Username must have a value.
            if (string.IsNullOrEmpty(Username))
            {
                return "Username is empty. Please fill Power BI username in web.config";
            }

            // Password must have a value.
            if (string.IsNullOrEmpty(Password))
            {
                return "Password is empty. Please fill password of Power BI username in web.config";
            }

            return null;
        }
    }
}
