// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UpdateCredentials.Models
{
	using System;

	public class EncryptCredentialsMap
	{
        // Gateway Id of corresponding dataset
		public Guid GatewayId { get; set; }

        // Type of credential
		public string CredentialType { get; set; }

        // Credentials provided by user
		public string[] Credentials {get; set;}

		// Set default Privacy Level to None for encrypting credentials feature
		public string PrivacyLevel = "None";
    }
}