let auth = require(__dirname + "/authentication.js");
let config = require(__dirname + "/../config/config.json");
let utils = require(__dirname + "/utils.js");
const fetch = require('node-fetch');

async function generateEmbedToken() {

    // Check for any non-existing credential or invalid credential from config.json file
    configCheckResult = utils.validateConfig();
    if (configCheckResult) {
        return {
            "status": 400,
            "error": configCheckResult
        };
    }

    let tokenResponse = null;
    let errorResponse = null;

    // Call the function to get the response from the authentication request
    try {
        tokenResponse = await auth.getAuthenticationToken();
    } catch (err) {
        if (err.hasOwnProperty('error_description') && err.hasOwnProperty('error')) {
            errorResponse = err.error_description;
        } else {

            // Invalid PowerBI Username provided
            errorResponse = err.toString();
        }
        return {
            "status": 401,
            "error": errorResponse
        };
    }

    // Extract AccessToken from the response
    let token = tokenResponse.accessToken;

    // embedData will be used for resolution of the Promise
    let embedData = null;

    // Call the function to get the Report Embed details
    try {
        embedData = await getReportEmbedDetails(token, config.workspaceId, config.reportId);

        // Call the function to get the Embed Token
        let embedToken = await getReportEmbedToken(token, embedData);
        return {
            "accessToken": embedToken.token,
            "embedUrl": embedData.embedUrl,
            "expiry": embedToken.expiration,
            "status": 200
        };
    } catch (err) {
        return {
            "status": err.status,
            "error": 'Error while retrieving report embed details\r\n' + err.statusText + '\r\nRequestId: \n' + err.headers.get('requestid')
        }
    }
}

async function getReportEmbedDetails(token, workspaceId, reportId) {
    const reportUrl = "https://api.powerbi.com/v1.0/myorg/groups/" + workspaceId + "/reports/" + reportId;
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": utils.getAuthHeader(token)
    };

    // Used node-fetch to call the PowerBI REST API
    let result = await fetch(reportUrl, {
        method: 'GET',
        headers: headers,
    })
    if (!result.ok)
        throw result;
    return result.json();
}

async function getReportEmbedToken(token, embedData) {
    const embedTokenUrl = "https://api.powerbi.com/v1.0/myorg/GenerateToken";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": utils.getAuthHeader(token)
    };

    const formData = {
        "datasets": [{
            "id": embedData.datasetId
        }],
        "reports": [{
            "id": embedData.id
        }]
    };

    // Used node-fetch to call the PowerBI REST API
    let result = await fetch(embedTokenUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
    });
    if (!result.ok)
        throw result;
    return result.json();
}

module.exports = {
    generateEmbedToken: generateEmbedToken
}