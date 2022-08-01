// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Refer https://aka.ms/PowerBIPermissions for complete list of Power BI scopes

// Replace this config with the one in the Config.ts file for sovereign cloud

// URL used for initiating authorization request
export const authorityUrl: string = "https://login.microsoftonline.com/common/";

// End point URL for Power BI API
export const powerBiApiUrl: string = "https://api.powerbi.com";

// Scope for securing access token
export const scopeBase: string[] = ["https://analysis.windows.net/powerbi/api/Report.Read.All"];