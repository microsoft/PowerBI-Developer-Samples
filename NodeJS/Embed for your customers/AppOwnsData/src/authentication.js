// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

const getAccessToken = async function () {

    // Use ADAL.js for authentication
    let adal = require("adal-node");

    let AuthenticationContext = adal.AuthenticationContext;

    // Create a config variable that store credentials from config.json
    let config = require(__dirname + "/../config/config.json");

    let authorityUrl = config.authorityUrl;

    // Check for the MasterUser Authentication
    if (config.authenticationMode.toLowerCase() === "masteruser") {
        let context = new AuthenticationContext(authorityUrl);

        return new Promise(
            (resolve, reject) => {
                context.acquireTokenWithUsernamePassword(config.scopeBase, config.pbiUsername, config.pbiPassword, config.clientId, function (err, tokenResponse) {

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
        authorityUrl = authorityUrl.replace("common", config.tenantId);
        let context = new AuthenticationContext(authorityUrl);

        return new Promise(
            (resolve, reject) => {
                context.acquireTokenWithClientCredentials(config.scopeBase, config.clientId, config.clientSecret, function (err, tokenResponse) {

                    // Function returns error object in tokenResponse
                    // Invalid Username will return empty tokenResponse, thus err is used
                    if (err) {
                        reject(tokenResponse == null ? err : tokenResponse);
                    }
                    resolve(tokenResponse);
                })
            }
        );
    }
}

module.exports.getAccessToken = getAccessToken;