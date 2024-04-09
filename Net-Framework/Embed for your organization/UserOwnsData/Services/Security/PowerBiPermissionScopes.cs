// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Services.Security
{
	using System.Configuration;

	public class PowerBIPermissionScopes
	{
		private static readonly string scopeBase = ConfigurationManager.AppSettings["scopeBase"];

		public static readonly string[] ReadUserWorkspaces = new string[] {
			scopeBase + "Workspace.Read.All",
			scopeBase + "Report.Read.All",
			scopeBase + "Dashboard.Read.All"
		};
	}
}
