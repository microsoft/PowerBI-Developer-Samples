// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UpdateCredentials.Models
{
	public class Constants
	{
        // Master user authentication mode
        public const string MasterUser = "masteruser";

        // Service principal authentication mode
        public const string ServicePrincipal = "serviceprincipal";

        // Key Credentials type
        public const string KeyCredentials = "Key";

        // Basic credentials type
        public const string BasicCredentials = "Basic";

        // OAuth credentials type
        public const string OAuth2Credentials = "OAuth2";

        // Windows credentials type
        public const string WindowsCredentials = "Windows";

        // Error message for invalid credential type
        public static string InvalidCredType = "Invalid Credential type";

        // Error message for invalid app setting configurations
        public static string InvalidAppSetting = "is not set in appsettings.json file";
    }
}