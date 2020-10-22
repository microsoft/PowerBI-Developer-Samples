// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Services.Security
{
	using System.Configuration;

	public class PowerBIPermissionScopes
	{
		private static readonly string powerBiPermissionApi = ConfigurationManager.AppSettings["powerBiPermissionApi"];

		public static readonly string[] ReadUserWorkspaces = new string[] {
			powerBiPermissionApi + "Workspace.Read.All",
			powerBiPermissionApi + "Report.Read.All",
			powerBiPermissionApi + "Dashboard.Read.All"
		};
	}
}
