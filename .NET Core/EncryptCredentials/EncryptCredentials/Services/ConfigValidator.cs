// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace EncryptCredentials.Services
{
	using EncryptCredentials.Models;
	using Microsoft.Extensions.Options;
	using System;

	public class ConfigValidator
	{
		/// <summary>
		/// Validates whether all the configuration parameters are set in appsettings.json file
		/// </summary>
		/// <param name="appSettings">Contains appsettings.json configuration values</param>
		/// <returns></returns>
		public static string ValidateConfig(IOptions<AzureAd> azureAd)
		{
			string message = null;
			bool isAuthModeMasterUser = azureAd.Value.AuthenticationMode.Equals("masteruser", StringComparison.InvariantCultureIgnoreCase);
			bool isAuthModeServicePrincipal = azureAd.Value.AuthenticationMode.Equals("serviceprincipal", StringComparison.InvariantCultureIgnoreCase);

			if (string.IsNullOrWhiteSpace(azureAd.Value.AuthenticationMode) || !(isAuthModeMasterUser) && !(isAuthModeServicePrincipal))
			{	
				message = $"Authentication mode is incorrect or {Constants.InvalidAppSetting}";
			}
			else if (string.IsNullOrWhiteSpace(azureAd.Value.AuthorityUri))
			{
				message = $"Authority {Constants.InvalidAppSetting}";
			}
			else if (string.IsNullOrWhiteSpace(azureAd.Value.ClientId))
			{
				message = $"Client Id {Constants.InvalidAppSetting}";
			}
			else if (isAuthModeServicePrincipal && string.IsNullOrWhiteSpace(azureAd.Value.TenantId))
			{
				message = $"Tenant Id {Constants.InvalidAppSetting}";
			}
			else if (azureAd.Value.Scope is null || azureAd.Value.Scope.Length == 0)
			{
				message = $"Scope {Constants.InvalidAppSetting}";
			}
			else if (isAuthModeMasterUser && string.IsNullOrWhiteSpace(azureAd.Value.PbiUsername))
			{
				message = $"Master user email {Constants.InvalidAppSetting}";
			}
			else if (isAuthModeMasterUser && string.IsNullOrWhiteSpace(azureAd.Value.PbiPassword))
			{
				message = $"Master user password {Constants.InvalidAppSetting}";
			}
			else if (isAuthModeServicePrincipal && string.IsNullOrWhiteSpace(azureAd.Value.ClientSecret))
			{
				message = $"Client secret {Constants.InvalidAppSetting}";
			}

			return message;
		}
	}
}
