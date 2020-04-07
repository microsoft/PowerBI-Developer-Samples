var auth = require(__dirname + "/authentication.js");
var config = require(__dirname + "/../config/config.json");
var utils = require(__dirname + "/utils.js");
var request = require("request");

async function generateEmbedToken() {

    // Check for any non-existing credential or invalid credential from config.json file
    configCheckResult = utils.validateConfig();
    if (configCheckResult) {
        return {
            "status": 400,
            "error": configCheckResult
        };
    }

    var tokenResponse = null;
    var errorResponse = null;

    // Call the function to get the response from the authentication request
    await auth.getAuthenticationToken().then(
        res => tokenResponse = res
    ).catch(

        // Handle errors in authentication
        err => {

            // Catch errors in authentication
            if (err.hasOwnProperty('error_description') && err.hasOwnProperty('error')) {
                errorResponse = err.error_description;
            } else {

                // Invalid PowerBI Username provided
                errorResponse = err.toString();
            }
        }
    );

    // Check for Invalid Authentication and return the errors to the UI
    if (errorResponse) {
        return {
            "status": 401,
            "error": errorResponse
        };
    }

    // Extract AccessToken from the response
    var token = tokenResponse.accessToken;

    const getReportEmbedDetails = async function(token, workspaceId, reportId) {
        return new Promise(function(resolve, reject) {
            const reportUrl = "https://api.powerbi.com/v1.0/myorg/groups/" + workspaceId + "/reports/" + reportId;
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": utils.getAuthHeader(token)
            };

            request.get({
                url: reportUrl,
                headers: headers
            }, function(err, result, body) {

                // Handle all the error cases
                if (result.statusCode !== 200) {
                    return reject(result);
                }
                try {
                    // Parsing the body using JSON.parse()
                    const bodyObj = JSON.parse(body);
                    resolve(bodyObj);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    // embedData will be used for resolving the promise, embedError will be used for the rejection of the promise
    var embedData = null;
    var embedError = null;
    await getReportEmbedDetails(token, config.workspaceId, config.reportId)
        .then(bodyObj => embedData = bodyObj)
        .catch(err => embedError = err);

    // If the embedError object is not null then it will be error
    if (embedError) {
        return {
            "status": 500,
            "error": 'Invalid Workspace ID or Report ID. Please change it in config.json.'
        }
    }

    const getReportEmbedToken = async function() {
        return new Promise(function(resolve, reject) {
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

            request.post({
                url: embedTokenUrl,
                form: formData,
                headers: headers,

            }, function(err, result, body) {
                if (err) return reject(err);
                const bodyObj = JSON.parse(body);
                resolve(bodyObj);
            });
        })
    }
    var embedToken = await getReportEmbedToken();

    return {
        "accessToken": embedToken.token,
        "embedUrl": embedData.embedUrl,
        "expiry": embedToken.expiration,
        "status": 200
    };
}

module.exports = {
    generateEmbedToken: generateEmbedToken
}