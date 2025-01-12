// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

const auth = require(__dirname + "/authentication.js");
const config = require(__dirname + "/../config/config.json");
const utils = require(__dirname + "/utils.js");
const PowerBiReportDetails = require(__dirname + "/../models/embedReportConfig.js");
const EmbedConfig = require(__dirname + "/../models/embedConfig.js");
const fetch = require('node-fetch');

/**
 * Generate embed token and embed urls for reports
 * @return Details like Embed URL, Access token and Expiry
 */
async function getEmbedInfo() {

    // Get the Report Embed details
    try {

        // Get report details and embed token
        const embedParams = await getEmbedParamsForSingleReport(config.workspaceId, config.reportId);

        return {
            'accessToken': embedParams.embedToken.token,
            'embedUrl': embedParams.reportsDetail,
            'expiry': embedParams.embedToken.expiration,
            'status': 200
        };
    } catch (err) {
        const errorBody = JSON.stringify(await err.json());

        return {
            'status': err.status,
            'error': `Error while retrieving report embed details\r\nStatus: ${err.status + ' ' + err.statusText}\r\nResponse: ${errorBody}\r\nRequestId: \n${err.headers.get('requestid')}`
        }
    }
}

/**
 * Get embed params for a single report for a single workspace
 * @param {string} workspaceId
 * @param {string} reportId
 * @param {string} additionalDatasetId - Optional Parameter
 * @return EmbedConfig object
 */
async function getEmbedParamsForSingleReport(workspaceId, reportId, additionalDatasetId) {
    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
    const headers = await getRequestHeader();

    // Get report info by calling the PowerBI REST API
    const result = await fetch(reportInGroupApi, {
        method: 'GET',
        headers: headers,
    })

    if (!result.ok) {
        throw result;
    }

    // Convert result in json to retrieve values
    const resultJson = await result.json();

    // Add report data for embedding
    const reportDetails = new PowerBiReportDetails(resultJson.id, resultJson.name, resultJson.embedUrl);
    const reportEmbedConfig = new EmbedConfig();

    // Create mapping for report and Embed URL
    reportEmbedConfig.reportsDetail = [reportDetails];

    // Create list of datasets
    let datasetIds = [resultJson.datasetId];

    // Append additional dataset to the list to achieve dynamic binding later
    if (additionalDatasetId) {
        datasetIds.push(additionalDatasetId);
    }

    // Get Embed token multiple resources
    reportEmbedConfig.embedToken = await getEmbedTokenForSingleReportSingleWorkspace(reportId, datasetIds, workspaceId);
    return reportEmbedConfig;
}

/**
 * Get embed params for multiple reports for a single workspace
 * @param {string} workspaceId
 * @param {Array<string>} reportIds
 * @param {Array<string>} additionalDatasetIds - Optional Parameter
 * @return EmbedConfig object
 */
async function getEmbedParamsForMultipleReports(workspaceId, reportIds, additionalDatasetIds) {

    // EmbedConfig object 
    const reportEmbedConfig = new EmbedConfig();

    // Create array of embedReports for mapping
    reportEmbedConfig.reportsDetail = [];

    // Create Array of datasets
    let datasetIds = [];

    // Get datasets and Embed URLs for all the reports
    for (const reportId of reportIds) {
        const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
        const headers = await getRequestHeader();

        // Get report info by calling the PowerBI REST API
        const result = await fetch(reportInGroupApi, {
            method: 'GET',
            headers: headers,
        })

        if (!result.ok) {
            throw result;
        }

        // Convert result in json to retrieve values
        const resultJson = await result.json();

        // Store result into PowerBiReportDetails object
        const reportDetails = new PowerBiReportDetails(resultJson.id, resultJson.name, resultJson.embedUrl);

        // Create mapping for reports and Embed URLs
        reportEmbedConfig.reportsDetail.push(reportDetails);

        // Push datasetId of the report into datasetIds array
        datasetIds.push(resultJson.datasetId);
    }

    // Append to existing list of datasets to achieve dynamic binding later
    if (additionalDatasetIds) {
        datasetIds.push(...additionalDatasetIds);
    }

    // Get Embed token multiple resources
    reportEmbedConfig.embedToken = await getEmbedTokenForMultipleReportsSingleWorkspace(reportIds, datasetIds, workspaceId);
    return reportEmbedConfig;
}

/**
 * Get Embed token for single report, multiple datasets, and an optional target workspace
 * @param {string} reportId
 * @param {Array<string>} datasetIds
 * @param {string} targetWorkspaceId - Optional Parameter
 * @return EmbedToken
 */
async function getEmbedTokenForSingleReportSingleWorkspace(reportId, datasetIds, targetWorkspaceId) {

    // Add report id in the request
    let formData = {
        'reports': [{
            'id': reportId
        }]
    };

    // Add dataset ids in the request
    formData['datasets'] = [];
    for (const datasetId of datasetIds) {
        formData['datasets'].push({
            'id': datasetId
        })
    }

    // Add targetWorkspace id in the request
    if (targetWorkspaceId) {
        formData['targetWorkspaces'] = [];
        formData['targetWorkspaces'].push({
            'id': targetWorkspaceId
        })
    }

    const embedTokenApi = "https://api.powerbi.com/v1.0/myorg/GenerateToken";
    const headers = await getRequestHeader();

    // Generate Embed token for single report, workspace, and multiple datasets. Refer https://aka.ms/MultiResourceEmbedToken
    const result = await fetch(embedTokenApi, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
    });

    if (!result.ok)
        throw result;
    return result.json();
}

/**
 * Get Embed token for multiple reports, multiple datasets, and an optional target workspace
 * @param {Array<string>} reportIds
 * @param {Array<string>} datasetIds
 * @param {String} targetWorkspaceId - Optional Parameter
 * @return EmbedToken
 */
async function getEmbedTokenForMultipleReportsSingleWorkspace(reportIds, datasetIds, targetWorkspaceId) {

    // Add dataset ids in the request
    let formData = { 'datasets': [] };
    for (const datasetId of datasetIds) {
        formData['datasets'].push({
            'id': datasetId
        })
    }

    // Add report ids in the request
    formData['reports'] = [];
    for (const reportId of reportIds) {
        formData['reports'].push({
            'id': reportId
        })
    }

    // Add targetWorkspace id in the request
    if (targetWorkspaceId) {
        formData['targetWorkspaces'] = [];
        formData['targetWorkspaces'].push({
            'id': targetWorkspaceId
        })
    }

    const embedTokenApi = "https://api.powerbi.com/v1.0/myorg/GenerateToken";
    const headers = await getRequestHeader();

    // Generate Embed token for multiple datasets, reports and single workspace. Refer https://aka.ms/MultiResourceEmbedToken
    const result = await fetch(embedTokenApi, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
    });

    if (!result.ok)
        throw result;
    return result.json();
}

/**
 * Get Embed token for multiple reports, multiple datasets, and optional target workspaces
 * @param {Array<string>} reportIds
 * @param {Array<string>} datasetIds
 * @param {Array<string>} targetWorkspaceIds - Optional Parameter
 * @return EmbedToken
 */
async function getEmbedTokenForMultipleReportsMultipleWorkspaces(reportIds, datasetIds, targetWorkspaceIds) {

    // Note: This method is an example and is not consumed in this sample app

    // Add dataset ids in the request
    let formData = { 'datasets': [] };
    for (const datasetId of datasetIds) {
        formData['datasets'].push({
            'id': datasetId
        })
    }

    // Add report ids in the request
    formData['reports'] = [];
    for (const reportId of reportIds) {
        formData['reports'].push({
            'id': reportId
        })
    }

    // Add targetWorkspace ids in the request
    if (targetWorkspaceIds) {
        formData['targetWorkspaces'] = [];
        for (const targetWorkspaceId of targetWorkspaceIds) {
            formData['targetWorkspaces'].push({
                'id': targetWorkspaceId
            })
        }
    }

    const embedTokenApi = "https://api.powerbi.com/v1.0/myorg/GenerateToken";
    const headers = await getRequestHeader();

    // Generate Embed token for multiple datasets, reports and workspaces. Refer https://aka.ms/MultiResourceEmbedToken
    const result = await fetch(embedTokenApi, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
    });

    if (!result.ok)
        throw result;
    return result.json();
}

/**
 * Get Request header
 * @return Request header with Bearer token
 */
async function getRequestHeader() {

    // Store authentication token
    let tokenResponse;

    // Store the error thrown while getting authentication token
    let errorResponse;

    // Get the response from the authentication request
    try {
        tokenResponse = await auth.getAccessToken();
    } catch (err) {
        if (err.hasOwnProperty('error_description') && err.hasOwnProperty('error')) {
            errorResponse = err.error_description;
        } else {

            // Invalid PowerBI Username provided
            errorResponse = err.toString();
        }
        return {
            'status': 401,
            'error': errorResponse
        };
    }

    // Extract AccessToken from the response
    const token = tokenResponse.accessToken;
    return {
        'Content-Type': "application/json",
        'Authorization': utils.getAuthHeader(token)
    };
}

module.exports = {
    getEmbedInfo: getEmbedInfo
}