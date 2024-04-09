// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace AppOwnsData.Services
{
    using System;
    using System.Configuration;

    public class ConfigValidatorService
    {
        public static readonly string ApplicationId = ConfigurationManager.AppSettings["applicationId"];
        public static readonly Guid WorkspaceId = GetParamGuid(ConfigurationManager.AppSettings["workspaceId"]);
        public static readonly Guid ReportId = GetParamGuid(ConfigurationManager.AppSettings["reportId"]);
        public static readonly string AuthenticationType = ConfigurationManager.AppSettings["authenticationType"];
        public static readonly string ApplicationSecret = ConfigurationManager.AppSettings["applicationSecret"];
        public static readonly string Tenant = ConfigurationManager.AppSettings["tenant"];
        public static readonly string Username = ConfigurationManager.AppSettings["pbiUsername"];
        public static readonly string Password = ConfigurationManager.AppSettings["pbiPassword"];

        /// <summary>
        /// Check if web.config embed parameters have valid values.
        /// </summary>
        /// <returns>Null if web.config parameters are valid, otherwise returns specific error string.</returns>
        public static string GetWebConfigErrors()
        {
            string message = null;
            Guid result;

            // Application Id must have a value.
            if (string.IsNullOrWhiteSpace(ApplicationId))
            {
                message = "ApplicationId is empty. please register your application as Native app in https://dev.powerbi.com/apps and fill client Id in web.config.";
            }
            // Application Id must be a Guid object.
            else if (!Guid.TryParse(ApplicationId, out result))
            {
                message = "ApplicationId must be a Guid object. please register your application as Native app in https://dev.powerbi.com/apps and fill application Id in web.config.";
            }
            // Workspace Id must have a value.
            else if (WorkspaceId == Guid.Empty)
            {
                message = "WorkspaceId is empty or not a valid Guid. Please fill its Id correctly in web.config";
            }
            // Report Id must have a value.
            else if (ReportId == Guid.Empty)
            {
                message = "ReportId is empty or not a valid Guid. Please fill its Id correctly in web.config";
            }
            else if (AuthenticationType.Equals("masteruser", StringComparison.InvariantCultureIgnoreCase))
            {
                // Username must have a value.
                if (string.IsNullOrWhiteSpace(Username))
                {
                    message = "Username is empty. Please fill Power BI username in web.config";
                }

                // Password must have a value.
                if (string.IsNullOrWhiteSpace(Password))
                {
                    message = "Password is empty. Please fill password of Power BI username in web.config";
                }
            }
            else if (AuthenticationType.Equals("serviceprincipal", StringComparison.InvariantCultureIgnoreCase))
            {
                if (string.IsNullOrWhiteSpace(ApplicationSecret))
                {
                    message = "ApplicationSecret is empty. please register your application as Web app and fill appSecret in web.config.";
                }
                // Must fill tenant Id
                else if (string.IsNullOrWhiteSpace(Tenant))
                {
                    message = "Invalid Tenant. Please fill Tenant ID in Tenant under web.config";
                }
            }
            else
            {
                message = "Invalid authentication type";
            }

            return message;
        }

        private static Guid GetParamGuid(string param)
        {
            Guid paramGuid = Guid.Empty;
            Guid.TryParse(param, out paramGuid);
            return paramGuid;
        }
    }
}
