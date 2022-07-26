// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

const getAccessToken = async function () {

    // Use ADAL.js for authentication
    let adal = require("adal-node");
    let msal = require("@azure/msal-node");

    let AuthenticationContext = adal.AuthenticationContext;

    // Create a config variable that store credentials from config.json
    let config = require(__dirname + "/../config/config.json");

    let authorityUrl = config.authorityUri;

    // Check for the MasterUser Authentication
    if (config.authenticationMode.toLowerCase() === "masteruser") {
        let context = new AuthenticationContext(authorityUrl);

        return new Promise(
            (resolve, reject) => {
                context.acquireTokenWithUsernamePassword(config.scope, config.pbiUsername, config.pbiPassword, config.clientId, function (err, tokenResponse) {

                    // Function returns error object in tokenResponse
                    // Invalid Username will return empty tokenResponse, thus err is used
                    if (err) {
                        reject(tokenResponse == null ? err : tokenResponse);
                    }
                    resolve(tokenResponse);
                })
            }
        );

        // Service Principal auth is the recommended by Microsoft to achieve App Owns Data Power BI embedding
    } else if (config.authenticationMode.toLowerCase() === "serviceprincipal") {
        let authorityUri = `${config.authorityUriServicePrincipal}` + `${config.tenantId}`

        // Initialize MSAL
        const msalConfig = {
            auth: {
                clientId: `${config.clientId}`,
                authority: `${authorityUri}`,
                clientSecret: `${config.clientSecret}`,
            }
        };

        const cca = new msal.ConfidentialClientApplication(msalConfig);

        // Requesting tokens
        const tokenRequest = {
            scopes: ['https://analysis.windows.net/powerbi/api/.default'],
        };

        // async function tokenResponse() { 
        let response = await cca.acquireTokenByClientCredential(tokenRequest);
        return response;
    }
}

module.exports.getAccessToken = getAccessToken;