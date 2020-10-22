// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Service
{
    using UserOwnsData.Models;
    using Microsoft.Identity.Web;
    using Microsoft.PowerBI.Api;
    using Microsoft.PowerBI.Api.Models;
    using Microsoft.Rest;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class PowerBiService
    {
        private const string m_urlPowerBiServiceApiRoot = "https://api.powerbi.com/";
        private ITokenAcquisition m_tokenAcquisition { get; }

        public PowerBiService(ITokenAcquisition tokenAcquisition)
        {
            this.m_tokenAcquisition = tokenAcquisition;
        }

        /// <summary>
        /// Returns embed config for given report
        /// </summary>
        /// <param name="reportId">Report to be embedded</param>
        /// <param name="workspaceId">Workspace id of report</param>
        /// <returns>String containing embed url</returns>
        public async Task<EmbedConfig> GetReportEmbedConfigAsync(string reportId, string workspaceId)
        {
            var accessToken = await m_tokenAcquisition.GetAccessTokenForUserAsync(new string[] { PowerBiScopes.ReadReport });
            using (var client = new PowerBIClient(new Uri(m_urlPowerBiServiceApiRoot), new TokenCredentials(accessToken, "Bearer")))
            {
                var report = await client.Reports.GetReportInGroupAsync(new Guid(workspaceId), new Guid(reportId));
                return new EmbedConfig(accessToken, report.EmbedUrl);
            }
        }

        /// <summary>
        /// Returns embed config for given dashboard
        /// </summary>
        /// <param name="dashboardId">Dashboard to be embedded</param>
        /// <param name="workspaceId">Workspace id of dashboard</param>
        /// <returns>String containing embed url</returns>
        public async Task<EmbedConfig> GetDashboardEmbedConfigAsync(string dashboardId, string workspaceId)
        {
            var accessToken = await m_tokenAcquisition.GetAccessTokenForUserAsync(new string[] { PowerBiScopes.ReadDashboard });
            using (var client = new PowerBIClient(new Uri(m_urlPowerBiServiceApiRoot), new TokenCredentials(accessToken, "Bearer")))
            {
                var dashboard = await client.Dashboards.GetDashboardInGroupAsync(new Guid(workspaceId), new Guid(dashboardId));
                return new EmbedConfig(accessToken, dashboard.EmbedUrl);
            }
        }

        /// <summary>
        /// Returns embed config for given tile
        /// </summary>
        /// <param name="dashboardId">Dashboard to be embedded</param>
        /// <param name="tileId">Tile to be embedded</param>
        /// <param name="workspaceId">Workspace id of tile</param>
        /// <returns>String containing embed url</returns>
        public async Task<EmbedConfig> GetTileEmbedConfigAsync(string dashboardId, string tileId, string workspaceId)
        {
            var accessToken = await m_tokenAcquisition.GetAccessTokenForUserAsync(new string[] { PowerBiScopes.ReadDashboard });
            using (var client = new PowerBIClient(new Uri(m_urlPowerBiServiceApiRoot), new TokenCredentials(accessToken, "Bearer")))
            {
                var tile = await client.Dashboards.GetTileInGroupAsync(new Guid(workspaceId), new Guid(dashboardId), new Guid(tileId));
                return new EmbedConfig(accessToken, tile.EmbedUrl);
            }
        }

        /// <summary>
        /// Returns a list of Power BI workspaces
        /// </summary>
        /// <returns>List of workspaces</returns>
        public async Task<IList<Group>> GetWorkspacesAsync()
        {
            var accessToken = await m_tokenAcquisition.GetAccessTokenForUserAsync(new string[] { PowerBiScopes.ReadWorkspace });
            using (var client = new PowerBIClient(new Uri(m_urlPowerBiServiceApiRoot), new TokenCredentials(accessToken, "Bearer")))
            {
                var groups = await client.Groups.GetGroupsAsync();
                return groups.Value;
            }
        }

        /// <summary>
        /// Returns a list of reports in a Power BI workspace
        /// </summary>
        /// <param name="workspaceId">Workspace id of reports</param>
        /// <returns>List of reports in a workspace</returns>
        public async Task<IList<Report>> GetReportsAsync(string workspaceId)
        {
            var accessToken = await m_tokenAcquisition.GetAccessTokenForUserAsync(new string[] { PowerBiScopes.ReadReport });
            using (var client = new PowerBIClient(new Uri(m_urlPowerBiServiceApiRoot), new TokenCredentials(accessToken, "Bearer")))
            {
                var reports = await client.Reports.GetReportsInGroupAsync(new Guid(workspaceId));
                return reports.Value;
            }
        }

        /// <summary>
        /// Returns a list of dashboards in a Power BI workspace
        /// </summary>
        /// <param name="workspaceId">Workspace id of dashboard</param>
        /// <returns>List of dashboard in a workspace</returns>
        public async Task<IList<Dashboard>> GetDashboardsAsync(string workspaceId)
        {
            var accessToken = await m_tokenAcquisition.GetAccessTokenForUserAsync(new string[] { PowerBiScopes.ReadDashboard });
            using (var client = new PowerBIClient(new Uri(m_urlPowerBiServiceApiRoot), new TokenCredentials(accessToken, "Bearer")))
            {
                var dashboard = await client.Dashboards.GetDashboardsInGroupAsync(new Guid(workspaceId));
                return dashboard.Value;
            }
        }

        /// <summary>
        /// Returns a list of tiles from a dashboard in a Power BI workspace
        /// </summary>
        /// <param name="dashboardId">Dashboard Id to get list of tiles</param>
        /// <param name="workspaceId">Workspace id of tile</param>
        /// <returns>List of tiles in a dashboard</returns>
        public async Task<IList<Tile>> GetTilesAsync(string dashboardId, string workspaceId)
        {
            var accessToken = await m_tokenAcquisition.GetAccessTokenForUserAsync(new string[] { PowerBiScopes.ReadDashboard });
            using (var client = new PowerBIClient(new Uri(m_urlPowerBiServiceApiRoot), new TokenCredentials(accessToken, "Bearer")))
            {
                var tile = await client.Dashboards.GetTilesInGroupAsync(new Guid(workspaceId), new Guid(dashboardId));
                return tile.Value;
            }
        }
    }
}