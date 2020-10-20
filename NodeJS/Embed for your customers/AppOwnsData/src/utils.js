// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

let config = require(__dirname + "/../config/config.json");

function getAuthHeader(accessToken) {

    // Function to append Bearer against the Access Token
    return "Bearer ".concat(accessToken);
}

function validateConfig() {

    // Validation function to check whether the Configurations are available in the config.json file or not

    let guid = require("guid");

    if (!config.authenticationMode) {
        return "AuthenticationMode is empty. Please choose MasterUser or ServicePrincipal in config.json.";
    }

    if (config.authenticationMode.toLowerCase() !== "masteruser" && config.authenticationMode.toLowerCase() !== "serviceprincipal") {
        return "AuthenticationMode is wrong. Please choose MasterUser or ServicePrincipal in config.json";
    }

    if (!config.clientId) {
        return "ClientId is empty. Please register your application as Native app in https://dev.powerbi.com/apps and fill Client Id in config.json.";
    }

    if (!guid.isGuid(config.clientId)) {
        return "ClientId must be a Guid object. Please register your application as Native app in https://dev.powerbi.com/apps and fill Client Id in config.json.";
    }

    if (!config.reportId) {
        return "ReportId is empty. Please select a report you own and fill its Id in config.json.";
    }

    if (!guid.isGuid(config.reportId)) {
        return "ReportId must be a Guid object. Please select a report you own and fill its Id in config.json.";
    }

    if (!config.workspaceId) {
        return "WorkspaceId is empty. Please select a group you own and fill its Id in config.json.";
    }

    if (!guid.isGuid(config.workspaceId)) {
        return "WorkspaceId must be a Guid object. Please select a workspace you own and fill its Id in config.json.";
    }

    if (!config.authorityUri) {
        return "AuthorityUri is empty. Please fill valid AuthorityUri in config.json.";
    }

    if (config.authenticationMode.toLowerCase() === "masteruser") {
        if (!config.pbiUsername || !config.pbiUsername.trim()) {
            return "PbiUsername is empty. Please fill Power BI username in config.json.";
        }

        if (!config.pbiPassword || !config.pbiPassword.trim()) {
            return "PbiPassword is empty. Please fill password of Power BI username in config.json.";
        }
    } else if (config.authenticationMode.toLowerCase() === "serviceprincipal") {
        if (!config.clientSecret || !config.clientSecret.trim()) {
            return "ClientSecret is empty. Please fill Power BI ServicePrincipal ClientSecret in config.json.";
        }

        if (!config.tenantId) {
            return "TenantId is empty. Please fill the TenantId in config.json.";
        }

        if (!guid.isGuid(config.tenantId)) {
            return "TenantId must be a Guid object. Please select a workspace you own and fill its Id in config.json.";
        }
    }
}

module.exports = {
    getAuthHeader: getAuthHeader,
    validateConfig: validateConfig,
}