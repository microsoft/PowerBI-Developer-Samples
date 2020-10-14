namespace DotNetCoreSaaS.Controllers
{
    using DotNetCoreSaaS.Service;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Identity.Web;
    using Microsoft.Rest;
    using System;
    using System.Net.Http;
    using System.Threading.Tasks;

    public class EmbedInfoController : Controller
    {
        private readonly PowerBiService m_powerBiService;

        public EmbedInfoController(PowerBiService powerBiService)
        {
            this.m_powerBiService = powerBiService;
        }

        /// <summary>
        /// Returns Embed URL of report to the client
        /// </summary>
        /// <param name="workspaceId">Workspace where the report resides</param>
        /// <param name="reportId">Report to be embedded</param>
        /// <returns>JSON containing embed url for embedding report</returns>
        [AuthorizeForScopes(Scopes = new string[] { PowerBiScopes.ReadReport })]
        [HttpGet]
        [Route("/embedinfo/reportembedurl")]
        public async Task<IActionResult> ReportEmbedConfigAsync(string workspaceId, string reportId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(workspaceId))
                {
                    throw new ArgumentNullException(nameof(workspaceId));
                }
                else if (string.IsNullOrWhiteSpace(reportId))
                {
                    throw new ArgumentNullException(nameof(reportId));
                }

                // Generates embedUrl and accessToken for report
                return this.Json(await m_powerBiService.GetReportEmbedConfigAsync(reportId, workspaceId));
            }
            catch (HttpOperationException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (HttpRequestException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (FormatException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (MicrosoftIdentityWebChallengeUserException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
        }

        /// <summary>
        /// Returns Embed URL of dashboard to the client
        /// </summary>
        /// <param name="workspaceId">Workspace where the dashboard resides</param>
        /// <param name="dashboardId">Dashboard to be embedded</param>
        /// <returns>JSON containing embed url for embedding dashboard</returns>
        [AuthorizeForScopes(Scopes = new string[] { PowerBiScopes.ReadDashboard })]
        [HttpGet]
        [Route("/embedinfo/dashboardembedurl")]
        public async Task<IActionResult> DashboardEmbedConfigAsync(string workspaceId, string dashboardId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(workspaceId))
                {
                    throw new ArgumentNullException(nameof(workspaceId));
                }
                else if (string.IsNullOrWhiteSpace(dashboardId))
                {
                    throw new ArgumentNullException(nameof(dashboardId));
                }

                // Generates embedUrl and accessToken for dashboard
                return this.Json(await m_powerBiService.GetDashboardEmbedConfigAsync(dashboardId, workspaceId));
            }
            catch (HttpOperationException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (HttpRequestException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (FormatException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (MicrosoftIdentityWebChallengeUserException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
        }

        /// <summary>
        /// Returns Embed URL of tile to the client
        /// </summary>
        /// <param name="workspaceId">Workspace where the dashboard and tile resides</param>
        /// <param name="dashboardId">Dashboard to be embedded</param>
        /// <param name="tileId">Tile to be embedded</param>
        /// <returns>JSON containing embed url for embedding tile</returns>
        [AuthorizeForScopes(Scopes = new string[] { PowerBiScopes.ReadDashboard })]
        [HttpGet]
        [Route("/embedinfo/tileembedurl")]
        public async Task<IActionResult> TileEmbedConfigAsync(string workspaceId, string dashboardId, string tileId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(workspaceId))
                {
                    throw new ArgumentNullException(nameof(workspaceId));
                }
                else if (string.IsNullOrWhiteSpace(dashboardId))
                {
                    throw new ArgumentNullException(nameof(dashboardId));
                }
                else if (string.IsNullOrWhiteSpace(tileId))
                {
                    throw new ArgumentNullException(nameof(tileId));
                }

                // Generates embedUrl and accessToken for tile
                return this.Json(await m_powerBiService.GetTileEmbedConfigAsync(dashboardId, tileId, workspaceId));
            }
            catch (HttpOperationException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (HttpRequestException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (FormatException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (MicrosoftIdentityWebChallengeUserException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
        }

        /// <summary>
        /// Returns workspaces names and their corresponding Ids to the client
        /// </summary>
        /// <returns>JSON containing list of Power BI workspaces</returns>
        [AuthorizeForScopes(Scopes = new string[] { PowerBiScopes.ReadWorkspace })]
        [HttpGet]
        [Route("/embedinfo/getworkspace")]
        public async Task<IActionResult> GetWorkspacesAsync()
        {
            try
            {
                // Retrieving workspaces
                return this.Json(await m_powerBiService.GetWorkspacesAsync());
            }
            catch (HttpRequestException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (FormatException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (MicrosoftIdentityWebChallengeUserException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
        }

        /// <summary>
        /// Returns reports names and their corresponding Ids to the client
        /// </summary>
        /// <param name="workspaceId">Workspace Id to get the list of reports</param>
        /// <returns>JSON containing list of Power BI reports</returns>
        [AuthorizeForScopes(Scopes = new string[] { PowerBiScopes.ReadReport })]
        [HttpGet]
        [Route("/embedinfo/getreport")]
        public async Task<IActionResult> GetReportsAsync(string workspaceId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(workspaceId))
                {
                    throw new ArgumentNullException(nameof(workspaceId));
                }

                // Retrieving reports in a workspace
                return this.Json(await m_powerBiService.GetReportsAsync(workspaceId));
            }
            catch (HttpRequestException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (FormatException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (MicrosoftIdentityWebChallengeUserException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
        }

        /// <summary>
        /// Returns dashboards names and their corresponding Ids to the client
        /// </summary>
        /// <param name="workspaceId">Workspace Id to get the list of dashboards</param>
        /// <returns>JSON containing list of Power BI dashboards</returns>
        [AuthorizeForScopes(Scopes = new string[] { PowerBiScopes.ReadDashboard })]
        [HttpGet]
        [Route("/embedinfo/getdashboard")]
        public async Task<IActionResult> GetDashboardsAsync(string workspaceId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(workspaceId))
                {
                    throw new ArgumentNullException(nameof(workspaceId));
                }

                // Retrieving dashboards in a workspace
                return this.Json(await m_powerBiService.GetDashboardsAsync(workspaceId));
            }
            catch (HttpRequestException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (FormatException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (MicrosoftIdentityWebChallengeUserException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
        }

        /// <summary>
        /// Returns tiles names and their corresponding Ids to the client
        /// </summary>
        /// <param name="workspaceId">Workspace Id to get the list of tiles</param>
        /// <param name="dashboardId">Dashboard Id to get list of tiles</param>
        /// <returns>JSON containing list of Power BI tiles</returns>
        [AuthorizeForScopes(Scopes = new string[] { PowerBiScopes.ReadDashboard })]
        [HttpGet]
        [Route("/embedinfo/gettile")]
        public async Task<IActionResult> GetTilesAsync(string workspaceId, string dashboardId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(workspaceId))
                {
                    throw new ArgumentNullException(nameof(workspaceId));
                }
                else if (string.IsNullOrWhiteSpace(dashboardId))
                {
                    throw new ArgumentNullException(nameof(dashboardId));
                }

                // Retrieving tiles in a dashboard
                return this.Json(await m_powerBiService.GetTilesAsync(dashboardId, workspaceId));
            }
            catch (HttpRequestException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (FormatException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
            catch (MicrosoftIdentityWebChallengeUserException ex)
            {
                Console.Error.WriteLine(ex);
                throw;
            }
        }
    }
}
