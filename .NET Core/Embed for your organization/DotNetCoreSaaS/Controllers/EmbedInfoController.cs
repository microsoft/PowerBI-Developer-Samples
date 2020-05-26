namespace DotNetCoreSaaS.Controllers
{
    using System;
    using System.Net.Http;
    using DotNetCoreSaaS.Service;
    using Microsoft.AspNetCore.Mvc;

    public class EmbedInfoController : Controller
    {
        /// <summary>
        /// Returns Embed URL of report to the client
        /// </summary>
        /// <param name="accessToken">Access token to generate embed url</param>
        /// <param name="workspaceId">Workspace where the report resides</param>
        /// <param name="reportId">Report to be embedded</param>
        /// <returns>JSON containing embed url for embedding report</returns>
        [HttpGet]
        [Route("/embedinfo/reportembedurl")]
        public JsonResult ReportEmbedUrl(string accessToken, string workspaceId, string reportId)
        {
            try
            {
                var powerBiService = new PowerBiService(accessToken, workspaceId);
                if (string.IsNullOrWhiteSpace(accessToken))
                {
                    throw new Exception("Access token cannot be null");
                }
                else if (string.IsNullOrWhiteSpace(workspaceId))
                {
                    throw new Exception("Workspace id cannot be null");
                }
                else if (string.IsNullOrWhiteSpace(reportId))
                {
                    throw new Exception("Report id cannot be null");
                }

                // Generates embedUrl for report
                else
                {
                    return this.Json(powerBiService.GetReportEmbedUrl(reportId));
                }
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
        }

        /// <summary>
        /// Returns Embed URL of dashboard to the client
        /// </summary>
        /// <param name="accessToken">Access token to generate embed url</param>
        /// <param name="workspaceId">Workspace where the dashboard resides</param>
        /// <param name="dashboardId">Dashboard to be embedded</param>
        /// <returns>JSON containing embed url for embedding dashboard</returns>
        [HttpGet]
        [Route("/embedinfo/dashboardembedurl")]
        public JsonResult DashboardEmbedUrl(string accessToken, string workspaceId, string dashboardId)
        {
            try
            {
                var powerBiService = new PowerBiService(accessToken, workspaceId);
                if (string.IsNullOrWhiteSpace(accessToken))
                {
                    throw new Exception("Access token cannot be null");
                }
                else if (string.IsNullOrWhiteSpace(workspaceId))
                {
                    throw new Exception("Workspace id cannot be null");
                }
                else if (string.IsNullOrWhiteSpace(dashboardId))
                {
                    throw new Exception("Dashboard id cannot be null");
                }

                // Generates embedUrl for dashboard
                else
                {
                    return this.Json(powerBiService.GetDashboardEmbedUrl(dashboardId));
                }
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
        }

        /// <summary>
        /// Returns Embed URL of tile to the client
        /// </summary>
        /// <param name="accessToken">Access token to generate embed url</param>
        /// <param name="workspaceId">Workspace where the dashboard and tile resides</param>
        /// <param name="dashboardId">Dashboard to be embedded</param>
        /// <param name="tileId">Tile to be embedded</param>
        /// <returns>JSON containing embed url for embedding tile</returns>
        [HttpGet]
        [Route("/embedinfo/tileembedurl")]
        public JsonResult TileEmbedUrl(string accessToken, string workspaceId, string dashboardId, string tileId)
        {
            try
            {
                var powerBiService = new PowerBiService(accessToken, workspaceId);
                if (string.IsNullOrWhiteSpace(accessToken))
                {
                    throw new Exception("Access token cannot be null");
                }
                else if (string.IsNullOrWhiteSpace(workspaceId))
                {
                    throw new Exception("Workspace id cannot be null");
                }
                else if (string.IsNullOrWhiteSpace(dashboardId))
                {
                    throw new Exception("Dashboard id cannot be null");
                }
                else if (string.IsNullOrWhiteSpace(tileId))
                {
                    throw new Exception("Tile id cannot be null");
                }

                // Generates embedUrl for tile
                else
                {
                    return this.Json(powerBiService.GetTileEmbedUrl(dashboardId, tileId));
                }
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
        }

        /// <summary>
        /// Returns workspaces names and their corresponding Ids to the client
        /// </summary>
        /// <param name="accessToken">Access token to get workspaces</param>
        /// <returns>JSON containing list of Power BI workspaces</returns>
        [HttpGet]
        [Route("/embedinfo/getworkspace")]
        public JsonResult GetWorkspace(string accessToken)
        {
            try
            {
                var powerBiService = new PowerBiService(accessToken);
                if (string.IsNullOrWhiteSpace(accessToken))
                {
                    throw new Exception("Access token cannot be null");
                }

                // Retrieving workspaces
                else
                {
                    return this.Json(powerBiService.GetWorkspaces());
                }
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
        }

        /// <summary>
        /// Returns reports names and their corresponding Ids to the client
        /// </summary>
        /// <param name="accessToken">Access token to get reports</param>
        /// <param name="workspaceId">Workspace Id to get the list of reports</param>
        /// <returns>JSON containing list of Power BI reports</returns>
        [HttpGet]
        [Route("/embedinfo/getreport")]
        public JsonResult GetReport(string accessToken, string workspaceId)
        {
            try
            {
                var powerBiService = new PowerBiService(accessToken, workspaceId);
                if (string.IsNullOrWhiteSpace(accessToken))
                {
                    throw new Exception("Access token cannot be null");
                }
                else if (string.IsNullOrWhiteSpace(workspaceId))
                {
                    throw new Exception("Workspace id cannot be null");
                }

                // Retrieving reports in a workspace
                else
                {
                    return this.Json(powerBiService.GetReports());
                }
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
        }

        /// <summary>
        /// Returns dashboards names and their corresponding Ids to the client
        /// </summary>
        /// <param name="accessToken">Access token to get dashboards</param>
        /// <param name="workspaceId">Workspace Id to get the list of dashboards</param>
        /// <returns>JSON containing list of Power BI dashboards</returns>
        [HttpGet]
        [Route("/embedinfo/getdashboard")]
        public JsonResult GetDashboard(string accessToken, string workspaceId)
        {
            try
            {
                var powerBiService = new PowerBiService(accessToken, workspaceId);
                if (string.IsNullOrWhiteSpace(accessToken))
                {
                    throw new Exception("Access token cannot be null");
                }
                else if (string.IsNullOrWhiteSpace(workspaceId))
                {
                    throw new Exception("Workspace id cannot be null");
                }

                // Retrieving dashboards in a workspace
                else
                {
                    return this.Json(powerBiService.GetDashboards());
                }
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
        }

        /// <summary>
        /// Returns tiles names and their corresponding Ids to the client
        /// </summary>
        /// <param name="accessToken">Access token to get tiles</param>
        /// <param name="workspaceId">Workspace Id to get the list of tiles</param>
        /// <param name="dashboardId">Dashboard Id to get list of tiles</param>
        /// <returns>JSON containing list of Power BI tiles</returns>
        [HttpGet]
        [Route("/embedinfo/gettile")]
        public JsonResult GetTile(string accessToken, string workspaceId, string dashboardId)
        {
            try
            {
                var powerBiService = new PowerBiService(accessToken, workspaceId);
                if (string.IsNullOrWhiteSpace(accessToken))
                {
                    throw new Exception("Access token cannot be null");
                }
                else if (string.IsNullOrWhiteSpace(workspaceId))
                {
                    throw new Exception("Workspace id cannot be null");
                }

                // Retrieving tiles in a dashboard
                else
                {
                    return this.Json(powerBiService.GetTiles(dashboardId));
                }
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
        }
    }
}