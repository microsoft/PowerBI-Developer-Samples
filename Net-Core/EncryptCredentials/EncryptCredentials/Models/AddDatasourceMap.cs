// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace EncryptCredentials.Models
{
	using System;
	
	public class AddDatasourceMap
	{
		// Gateway Id of corresponding dataset
		public Guid GatewayId { get; set; }

		// Type of credential
		public string CredentialType { get; set; }

		// Credentials provided by user
		public string[] Credentials {get; set;}

		// Privacy level
		public string PrivacyLevel { get; set; }
		
		// Type of datasource
		public string DatasourceType { get; set; }

		// Datasource Name provided by the user
		public string DatasourceName { get; set; }

		// Connection details for a datasource
		public string ConnectionDetails { get; set; }
	}
}
