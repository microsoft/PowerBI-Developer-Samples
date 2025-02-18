// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-inferrable-types */

// Scope Base of AAD app. Use the below configuration to use all the permissions provided in the AAD app through Azure portal.
// Refer https://aka.ms/PowerBIPermissions for complete list of Power BI scopes

// URL used for initiating authorization request
export const authorityUrl: string = "https://login.microsoftonline.com/";

// End point URL for Power BI API
export const powerBiApiUrl: string = "https://api.powerbi.com/";

// Scope for securing access token
export const scopeBase: string[] = ["https://analysis.windows.net/powerbi/api/Report.Read.All"];

// Client Id (Application Id) of the AAD app.
export const clientId: string = "";

// Id of the workspace where the report is hosted
export const workspaceId: string = "";

// Id of the report to be embedded
export const reportId: string = "";

// Directory (tenant) ID of the AAD app
export const tenantId: string = "";