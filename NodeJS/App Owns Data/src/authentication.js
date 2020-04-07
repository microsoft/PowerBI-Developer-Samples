const getAuthenticationToken = async function() {

    // Use ADAL.js for authentication
    var adal = require("adal-node");

    var AuthenticationContext = adal.AuthenticationContext;

    // Create a config variable that store credentials from config.json
    var config = require(__dirname + "/../config/config.json");

    var authorityUrl = config.authorityUri;

    // Check for the MasterUser Authentication
    if (config.authenticationMode.toLowerCase() === "masteruser") {
        var context = new AuthenticationContext(authorityUrl);

        return new Promise(
            (resolve, reject) => {
                context.acquireTokenWithUsernamePassword(config.scope, config.pbiUsername, config.pbiPassword, config.clientId, function(err, tokenResponse) {

                    // Function returns error object in tokenResponse
                    // Invalid Username will return empty tokenResponse, thus err is used
                    if (err) {
                        reject(tokenResponse == null ? err : tokenResponse);
                    }
                    resolve(tokenResponse);
                })
            }
        );

        // Check for ServicePrincipal Authentication
    } else if (config.authenticationMode.toLowerCase() === "serviceprincipal") {
        authorityUrl = authorityUrl.replace("common", config.tenantId);
        var context = new AuthenticationContext(authorityUrl);

        return new Promise(
            (resolve, reject) => {
                context.acquireTokenWithClientCredentials(config.scope, config.clientId, config.clientSecret, function(err, tokenResponse) {

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

module.exports.getAuthenticationToken = getAuthenticationToken;