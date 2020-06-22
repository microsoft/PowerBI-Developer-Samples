namespace DotNetCoreSaaS.Service
{
    using System;
    using System.Collections.Generic;
    using Microsoft.PowerBI.Api;
    using Microsoft.PowerBI.Api.Models;
    using Microsoft.Rest;

    public class PowerBiService
    {
        private string accessToken;
        private string workspaceId;
        private const string ApiUri = "https://api.powerbi.com/";

        /// <summary>
        /// Parameterized constructor to initialize access token and workspace id
        /// </summary>
        /// <param name="accessToken">Access token for accessing Power BI content</param>
        /// <param name="workspaceId">Workspace where the report, dashboard and tile resides</param>
        public PowerBiService(string accessToken, string workspaceId)
        {
            this.accessToken = accessToken;
            this.workspaceId = workspaceId;
        }

        /// <summary>
        /// Parameterized constructor to initialize access token
        /// </summary>
        /// <param name="accessToken">Access token for accessing Power BI content</param>
        public PowerBiService(string accessToken)
        {
            this.accessToken = accessToken;
        }

        /// <summary>
        /// Returns Embed URL for a report
        /// </summary>
        /// <param name="reportId">Report to be embedded</param>
        /// <returns>String containing embed url</returns>
        public string GetReportEmbedUrl(string reportId)
        {
            using (var client = new PowerBIClient(new Uri(ApiUri), new TokenCredentials(this.accessToken, "Bearer")))
            {
                return client.Reports.GetReportInGroup(new Guid(this.workspaceId), new Guid(reportId)).EmbedUrl;
            }
        }

        /// <summary>
        /// Returns Embed URL for a dashboard
        /// </summary>
        /// <param name="dashboardId">Dashboard to be embedded</param>
        /// <returns>String containing embed url</returns>
        public string GetDashboardEmbedUrl(string dashboardId)
        {
            using (var client = new PowerBIClient(new Uri(ApiUri), new TokenCredentials(this.accessToken, "Bearer")))
            {
                return client.Dashboards.GetDashboardInGroup(new Guid(this.workspaceId), new Guid(dashboardId)).EmbedUrl;
            }
        }

        /// <summary>
        /// Returns Embed URL for a tile
        /// </summary>
        /// <param name="dashboardId">Dashboard to be embedded</param>
        /// <param name="tileId">Tile to be embedded</param>
        /// <returns>String containing embed url</returns>
        public string GetTileEmbedUrl(string dashboardId, string tileId)
        {
            using (var client = new PowerBIClient(new Uri(ApiUri), new TokenCredentials(this.accessToken, "Bearer")))
            {
                return client.Dashboards.GetTileInGroup(new Guid(this.workspaceId), new Guid(dashboardId), new Guid(tileId)).EmbedUrl;
            }
        }

        /// <summary>
        /// Returns a list of Power BI workspaces
        /// </summary>
        /// <returns>List of workspaces</returns>
        public IList<Group> GetWorkspaces()
        {
            using (var client = new PowerBIClient(new Uri(ApiUri), new TokenCredentials(this.accessToken, "Bearer")))
            {
                return client.Groups.GetGroups().Value;
            }
        }

        /// <summary>
        /// Returns a list of reports in a Power BI workspace
        /// </summary>
        /// <returns>List of reports in a workspace</returns>
        public IList<Report> GetReports()
        {
            using (var client = new PowerBIClient(new Uri(ApiUri), new TokenCredentials(this.accessToken, "Bearer")))
            {
                return client.Reports.GetReportsInGroup(new Guid(this.workspaceId)).Value;
            }
        }

        /// <summary>
        /// Returns a list of dashboards in a Power BI workspace
        /// </summary>
        /// <returns>List of dashboard in a workspace</returns>
        public IList<Dashboard> GetDashboards()
        {
            using (var client = new PowerBIClient(new Uri(ApiUri), new TokenCredentials(this.accessToken, "Bearer")))
            {
                return client.Dashboards.GetDashboardsInGroup(new Guid(this.workspaceId)).Value;
            }
        }

        /// <summary>
        /// Returns a list of tiles from a dashboard in a Power BI workspace
        /// </summary>
        /// <param name="dashboardId">Dashboard Id to get list of tiles</param>
        /// <returns>List of tiles in a dashboard</returns>
        public IList<Tile> GetTiles(string dashboardId)
        {
            using (var client = new PowerBIClient(new Uri(ApiUri), new TokenCredentials(this.accessToken, "Bearer")))
            {
                return client.Dashboards.GetTilesInGroup(new Guid(this.workspaceId), new Guid(dashboardId)).Value;
            }
        }
    }
}