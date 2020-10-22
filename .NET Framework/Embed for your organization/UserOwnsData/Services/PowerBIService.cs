// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Services
{
	using UserOwnsData.Models;
	using UserOwnsData.Services.Security;
	using Microsoft.PowerBI.Api;
	using Microsoft.PowerBI.Api.Models;
	using Microsoft.Rest;
	using System;
	using System.Collections.Generic;
	using System.Configuration;
	using System.Threading.Tasks;

	public class PowerBIService
	{
		private static readonly string urlPowerBiServiceApiRoot = ConfigurationManager.AppSettings["powerBiApiUrl"];

		private static PowerBIClient GetPowerBiClient()
		{
			return GetPowerBiClient(PowerBIPermissionScopes.ReadUserWorkspaces);
		}

		private static PowerBIClient GetPowerBiClient(string[] scopes)
		{
			var tokenCredentials = new TokenCredentials(TokenManager.GetAccessToken(scopes), "Bearer");
			return new PowerBIClient(new Uri(urlPowerBiServiceApiRoot), tokenCredentials);
		}

		/// <summary>
		/// Returns Embed URL for a report
		/// </summary>
		/// <param name="workspaceId">Workspace where the report resides</param>
		/// <param name="reportId">Report to be embedded</param>
		/// <returns>Object of EmbedConfigModel containing embed url and access token</returns>
		public static async Task<EmbedConfigModel> GetReportEmbedConfigAsync(string workspaceId, string reportId)
		{
			using (var client = GetPowerBiClient())
			{
				Report report = await client.Reports.GetReportInGroupAsync(new Guid(workspaceId), new Guid(reportId));
				return new EmbedConfigModel
				{
					EmbedUrl = report.EmbedUrl,
					AccessToken = TokenManager.GetAccessToken()
				};
			}
		}

		/// <summary>
		/// Returns Embed URL for a dashboard
		/// </summary>
		/// <param name="workspaceId">Workspace where the dashboard resides</param>
		/// <param name="dashboardId">Dashboard to be embedded</param>
		/// <returns>Object of EmbedConfigModel containing embed url and access token</returns>
		public static async Task<EmbedConfigModel> GetDashboardEmbedConfigAsync(string workspaceId, string dashboardId)
		{
			using (var client = GetPowerBiClient())
			{
				Dashboard dashboard = await client.Dashboards.GetDashboardInGroupAsync(new Guid(workspaceId), new Guid(dashboardId));
				return new EmbedConfigModel
				{
					EmbedUrl = dashboard.EmbedUrl,
					AccessToken = TokenManager.GetAccessToken()
				};
			}
		}

		/// <summary>
		/// Returns Embed URL for a tile
		/// </summary>
		/// <param name="workspaceId">Workspace where the dashboard and tile resides</param>
		/// <param name="dashboardId">Dashboard to be embedded</param>
		/// <param name="tileId">Tile to be embedded</param>
		/// <returns>Object of EmbedConfigModel containing embed url and access token</returns>
		public static async Task<EmbedConfigModel> GetTileEmbedConfigAsync(string workspaceId, string dashboardId, string tileId)
		{
			using (var client = GetPowerBiClient())
			{
				Tile tile = await client.Dashboards.GetTileInGroupAsync(new Guid(workspaceId), new Guid(dashboardId), new Guid(tileId));
				return new EmbedConfigModel
				{
					EmbedUrl = tile.EmbedUrl,
					AccessToken = TokenManager.GetAccessToken()
				};
			}
		}

		/// <summary>
		/// Returns a list of Power BI workspaces
		/// </summary>
		/// <returns>List of workspaces</returns>
		public static async Task<IList<Group>> GetWorkspacesAsync()
		{
			using (var client = GetPowerBiClient())
			{
				var groups = await client.Groups.GetGroupsAsync();
				return groups.Value;
			}
		}

		/// <summary>
		/// Returns a list of reports in a Power BI workspace
		/// </summary>
		/// <param name="workspaceId">Workspace where the report resides</param>
		/// <returns>List of reports in a workspace</returns>
		public static async Task<IList<Report>> GetReportsAsync(string workspaceId)
		{
			using (var client = GetPowerBiClient())
			{
				var reports = await client.Reports.GetReportsInGroupAsync(new Guid(workspaceId));
				return reports.Value;
			}
		}

		/// <summary>
		/// Returns a list of dashboards in a Power BI workspace
		/// </summary>
		/// <param name="workspaceId">Workspace where the dashboard resides</param>
		/// <returns>List of dashboard in a workspace</returns>
		public static async Task<IList<Dashboard>> GetDashboardsAsync(string workspaceId)
		{
			using (var client = GetPowerBiClient())
			{
				var dashboards = await client.Dashboards.GetDashboardsInGroupAsync(new Guid(workspaceId));
				return dashboards.Value;
			}
		}

		/// <summary>
		/// Returns a list of tiles from a dashboard in a Power BI workspace
		/// </summary>
		/// <param name="workspaceId">Workspace where the dashboard and tile resides</param>
		/// <param name="dashboardId">Dashboard Id to get list of tiles</param>
		/// <returns>List of tiles in a dashboard</returns>
		public static async Task<IList<Tile>> GetTilesAsync(string workspaceId, string dashboardId)
		{
			using (var client = GetPowerBiClient())
			{
				var tiles = await client.Dashboards.GetTilesInGroupAsync(new Guid(workspaceId), new Guid(dashboardId));
				return tiles.Value;
			}
		}
	}
}