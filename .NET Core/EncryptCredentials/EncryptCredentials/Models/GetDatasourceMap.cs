// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace EncryptCredentials.Models
{
	using System;

	public class GetDatasourceMap
	{
		// Dataset Id of corresponding dataset
		public Guid DatasetId { get; set; }

		// Group Id of corresponding dataset
		public Guid GroupId { get; set; }
	}
}
