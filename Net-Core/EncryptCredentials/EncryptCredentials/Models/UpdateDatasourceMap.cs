// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace EncryptCredentials.Models
{
	using System;
	
	public class UpdateDatasourceMap
	{
		// Type of credential
		public string CredentialType { get; set; }

		// Credentials provided by user
		public string[] Credentials {get; set;}

		// Privacy level
		public string PrivacyLevel { get; set; }
		
		// Gateway Id of corresponding dataset
		public Guid GatewayId { get; set; }

		// Datasource Id of corresponding dataset
		public Guid DatasourceId { get; set; }
	}
}
