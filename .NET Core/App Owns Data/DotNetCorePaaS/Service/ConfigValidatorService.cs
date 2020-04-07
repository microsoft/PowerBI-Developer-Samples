namespace DotNetCorePaaS.Service
{
    using DotNetCorePaaS.Models;
    using Microsoft.Extensions.Options;
    using System;

    public class ConfigValidatorService
    {
        /// <summary>
        /// Validates whether all the configuration parameters are set in appsettings.json file
        /// </summary>
        /// <param name="appSettings">Contains appsettings.json configuration values</param>
        /// <returns></returns>
        public static string ValidateConfig(IOptions<ConfigurationModel> appSettings)
        {
            string message = null;
            bool isAuthModeMasterUser = appSettings.Value.AuthenticationMode.Equals("masteruser", StringComparison.InvariantCultureIgnoreCase);
            bool isAuthModeServicePrincipal = appSettings.Value.AuthenticationMode.Equals("serviceprincipal", StringComparison.InvariantCultureIgnoreCase);

            if (string.IsNullOrWhiteSpace(appSettings.Value.AuthenticationMode))
            {
                message = "Authentication mode is not set in appsettings.json file";
            }
            else if (string.IsNullOrWhiteSpace(appSettings.Value.AuthorityUri))
            {
                message = "Authority is not set in appsettings.json file";
            }
            else if (string.IsNullOrWhiteSpace(appSettings.Value.ClientId))
            {
                message = "Client Id is not set in appsettings.json file";
            }
            else if (isAuthModeServicePrincipal && string.IsNullOrWhiteSpace(appSettings.Value.TenantId))
            {
                message = "Tenant Id is not set in appsettings.json file";
            }
            else if (appSettings.Value.Scope is null || appSettings.Value.Scope.Length == 0)
            {
                message = "Scope is not set in appsettings.json file";
            }
            else if (string.IsNullOrWhiteSpace(appSettings.Value.WorkspaceId))
            {
                message = "Workspace Id is not set in appsettings.json file";
            }
            else if (!IsValidGuid(appSettings.Value.WorkspaceId))
            {
                message = "Please enter a valid guid for Workspace Id in appsettings.json file";
            }
            else if (string.IsNullOrWhiteSpace(appSettings.Value.ReportId))
            {
                message = "Report Id is not set in appsettings.json file";
            }
            else if (!IsValidGuid(appSettings.Value.ReportId))
            {
                message = "Please enter a valid guid for Report Id in appsettings.json file";
            }
            else if (isAuthModeMasterUser && string.IsNullOrWhiteSpace(appSettings.Value.PbiUsername))
            {
                message = "Master user email is not set in appsettings.json file";
            }
            else if (isAuthModeMasterUser && string.IsNullOrWhiteSpace(appSettings.Value.PbiPassword))
            {
                message = "Master user password is not set in appsettings.json file";
            }
            else if (isAuthModeServicePrincipal && string.IsNullOrWhiteSpace(appSettings.Value.ClientSecret))
            {
                message = "Client secret is not set in appsettings.json file";
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
