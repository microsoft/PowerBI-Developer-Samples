// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Controllers
{
	using UserOwnsData.Models;
	using UserOwnsData.Services;
	using System;
	using System.Net;
	using System.Net.Http;
	using System.Threading.Tasks;
	using System.Web.Mvc;

	public class EmbedInfoController : Controller
	{

		/// <summary>
		/// Returns Embed view when client is authorized
		/// </summary>
		/// <returns>Returns Embed view</returns>
		[Authorize]
		public async Task<ActionResult> Embed()
		{
			try
			{
				return View("embed", new WorkspaceList { Workspaces = await PowerBIService.GetWorkspacesAsync() });
			}
			catch (Exception ex)
			{
				ErrorModel errorModel = new ErrorModel
				{
					ErrorCode = (HttpStatusCode)500,
					ErrorMessage = ex.ToString()
				};
				return View("Error", errorModel);
			}
		}

		/// <summary>
		/// Returns Embed config of report to the client
		/// </summary>
		/// <param name="workspaceId">Workspace where the report resides</param>
		/// <param name="reportId">Report to be embedded</param>
		/// <returns>JSON containing access token and embed url for embedding report</returns>
		[Authorize]
		[HttpPost]
		[Route("/embedinfo/reportembedconfig")]
		public async Task<JsonResult> ReportEmbedConfig(string workspaceId, string reportId)
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

				// Generates embedConfig for report
				else
				{
					return this.Json(await PowerBIService.GetReportEmbedConfigAsync(workspaceId, reportId));
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
		/// Returns Embed config of dashboard to the client
		/// </summary>
		/// <param name="workspaceId">Workspace where the dashboard resides</param>
		/// <param name="dashboardId">Dashboard to be embedded</param>
		/// <returns>JSON containing access token and embed url for embedding dashboard</returns>
		[Authorize]
		[HttpPost]
		[Route("/embedinfo/dashboardembedconfig")]
		public async Task<JsonResult> DashboardEmbedConfig(string workspaceId, string dashboardId)
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

				// Generates embedConfig for dashboard
				else
				{
					return this.Json(await PowerBIService.GetDashboardEmbedConfigAsync(workspaceId, dashboardId));
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
		/// Returns Embed config of tile to the client
		/// </summary>
		/// <param name="workspaceId">Workspace where the dashboard and tile resides</param>
		/// <param name="dashboardId">Dashboard to be embedded</param>
		/// <param name="tileId">Tile to be embedded</param>
		/// <returns>JSON containing access token and embed url for embedding tile</returns>
		[Authorize]
		[HttpPost]
		[Route("/embedinfo/tileembedconfig")]
		public async Task<JsonResult> TileEmbedConfig(string workspaceId, string dashboardId, string tileId)
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

				// Generates embedConfig for tile
				else
				{
					return this.Json(await PowerBIService.GetTileEmbedConfigAsync(workspaceId, dashboardId, tileId));
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
		/// <param name="workspaceId">Workspace Id to get the list of reports</param>
		/// <returns>JSON containing list of Power BI reports</returns>
		[Authorize]
		[HttpPost]
		[Route("/embedinfo/getreport")]
		public async Task<JsonResult> GetReport(string workspaceId)
		{
			try
			{
				if (string.IsNullOrWhiteSpace(workspaceId))
				{
					throw new ArgumentNullException(nameof(workspaceId));
				}

				// Retrieving reports in a workspace
				else
				{
					return this.Json(await PowerBIService.GetReportsAsync(workspaceId));
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
		/// <param name="workspaceId">Workspace Id to get the list of dashboards</param>
		/// <returns>JSON containing list of Power BI dashboards</returns>
		[Authorize]
		[HttpPost]
		[Route("/embedinfo/getdashboard")]
		public async Task<JsonResult> GetDashboard(string workspaceId)
		{
			try
			{
				if (string.IsNullOrWhiteSpace(workspaceId))
				{
					throw new ArgumentNullException(nameof(workspaceId));
				}

				// Retrieving dashboards in a workspace
				else
				{
					return this.Json(await PowerBIService.GetDashboardsAsync(workspaceId));
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
		/// <param name="workspaceId">Workspace Id to get the list of tiles</param>
		/// <param name="dashboardId">Dashboard Id to get list of tiles</param>
		/// <returns>JSON containing list of Power BI tiles</returns>
		[Authorize]
		[HttpPost]
		[Route("/embedinfo/gettile")]
		public async Task<JsonResult> GetTile(string workspaceId, string dashboardId)
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
				else
				{
					return this.Json(await PowerBIService.GetTilesAsync(workspaceId, dashboardId));
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
