// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Models
{
	using Microsoft.PowerBI.Api.Models;
	using System.Collections.Generic;

	public class WorkspaceList
	{
		public IList<Group> Workspaces { get; set; }
	}
}
