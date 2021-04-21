// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace EncryptCredentials.Models
{
	public class AzureAd
	{
		// Can be set to 'MasterUser' or 'ServicePrincipal'
		public string AuthenticationMode { get; set; }

		// URL used for initiating authorization request
		public string AuthorityUri { get; set; }

		// Client Id (Application Id) of the AAD app
		public string ClientId { get; set; }

		// Id of the Azure tenant in which AAD app is hosted. Required only for Service Principal authentication mode.
		public string TenantId { get; set; }

		// Scope of AAD app. Use the below configuration to use all the permissions provided in the AAD app through Azure portal.
		public string[] Scope { get; set; }

		// Master user email address. Required only for MasterUser authentication mode.
		public string PbiUsername { get; set; }

		// Master user email password. Required only for MasterUser authentication mode.
		public string PbiPassword { get; set; }

		// Client Secret (App Secret) of the AAD app. Required only for ServicePrincipal authentication mode.
		public string ClientSecret { get; set; }
	}
}
