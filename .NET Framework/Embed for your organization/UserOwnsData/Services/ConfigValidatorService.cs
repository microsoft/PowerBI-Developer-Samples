// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Services
{
	using System;
	using System.Configuration;

	public class ConfigValidatorService
	{
		/// <summary>
		/// Validates whether all the configuration parameters are set in Web.config file
		/// </summary>
		/// <returns></returns>
		public static string ValidateConfig()
		{
			string message = null;
			if (string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["clientId"]))
			{
				message = "Client Id is not set in Web.config file";
			}
			else if (!IsValidGuid(ConfigurationManager.AppSettings["clientId"]))
			{
				message = "Please provide a valid guid for client Id in Web.config file";
			}
			else if (string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["clientSecret"]))
			{
				message = "Client secret is not set in Web.config file";
			}
			else if (string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["redirectUri"]))
			{
				message = "Redirect Uri is not set in Web.config file";
			}
			else if (string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["authorityUri"]))
			{
				message = "Authority Uri is not set in Web.config file";
			}
			else if (string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["powerBiApiUrl"]))
			{
				message = "Power BI Api Url is not set in Web.config file";
			}
			else if (string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["powerBiPermissionApi"]))
			{
				message = "Power BI Permission Api is not set in Web.config file";
			}

			return message;
		}

		/// <summary>
		/// Checks whether a string is a valid guid
		/// </summary>
		/// <param name="configParam">String value</param>
		/// <returns>Boolean value indicating validity of the guid</returns>
		private static bool IsValidGuid(string configParam)
		{
			Guid result = Guid.Empty;
			return Guid.TryParse(configParam, out result);
		}
	}
}
