// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace EncryptCredentials.Services
{
	using EncryptCredentials.Models;
	using Microsoft.Extensions.Options;
	using Microsoft.Identity.Client;
	using System;
	using System.Linq;
	using System.Security;

	public class AadService
	{
		private readonly IOptions<AzureAd> azureAd;

		public AadService(IOptions<AzureAd> azureAd)  
		{
			this.azureAd = azureAd;
		}

		/// <summary>
		/// Generates and returns Access token
		/// </summary>
		/// <returns>AAD token</returns>
		public string GetAccessToken()
		{
			AuthenticationResult authenticationResult = null;
			if (azureAd.Value.AuthenticationMode.Equals("masteruser", StringComparison.InvariantCultureIgnoreCase))
			{
				// Create a public client to authorize the app with the AAD app
				IPublicClientApplication clientApp = PublicClientApplicationBuilder.Create(azureAd.Value.ClientId).WithAuthority(azureAd.Value.AuthorityUri).Build();
				var userAccounts = clientApp.GetAccountsAsync().Result;
				try
				{
					// Retrieve Access token from cache if available
					authenticationResult = clientApp.AcquireTokenSilent(azureAd.Value.Scope, userAccounts.FirstOrDefault()).ExecuteAsync().Result;
				}
				catch (MsalUiRequiredException)
				{
					SecureString password = new SecureString();
					foreach (var key in azureAd.Value.PbiPassword)
					{
						password.AppendChar(key);
					}
					authenticationResult = clientApp.AcquireTokenByUsernamePassword(azureAd.Value.Scope, azureAd.Value.PbiUsername, password).ExecuteAsync().Result;
				}
			}

			// Service Principal auth is the recommended by Microsoft to achieve App Owns Data Power BI embedding
			else
			{
				// For app only authentication, we need the specific tenant id in the authority url
				var tenantSpecificUrl = azureAd.Value.AuthorityUri.Replace("organizations", azureAd.Value.TenantId);

				// Create a confidential client to authorize the app with the AAD app
				IConfidentialClientApplication clientApp = ConfidentialClientApplicationBuilder
																				.Create(azureAd.Value.ClientId)
																				.WithClientSecret(azureAd.Value.ClientSecret)
																				.WithAuthority(tenantSpecificUrl)
																				.Build();
				// Make a client call if Access token is not available in cache
				authenticationResult = clientApp.AcquireTokenForClient(azureAd.Value.Scope).ExecuteAsync().Result;
			}

			return authenticationResult.AccessToken;
		}
	}
}
