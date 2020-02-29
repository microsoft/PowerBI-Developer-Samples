var config = require('./config.js');

async function getAuthenticationToken() {
    var adal = require('adal-node');
    var fs = require('fs');
    var https = require('https');

    var AuthenticationContext = adal.AuthenticationContext;

    function turnOnLogging() {
        var log = adal.Logging;
        log.setLoggingOptions(
        {
        level : log.LOGGING_LEVEL.VERBOSE,
        log : function(level, message, error) {
            console.log(message);
            if (error) {
            console.log(error);
            }
        }
        });
    }

    turnOnLogging();

    // configuration based on authentication type
    var authorityUrl = null;
    if (config.params.authenticationType === 'MasterUser')  {
        authorityUrl = config.params.authorityUrl
        var casjson = fs.readFileSync(__dirname + '/cas.json');
        var cas = JSON.parse(casjson);
        https.globalAgent.options.ca = cas;
    } else {
        var authorityUrl = config.params.authorityUrl.replace('common', config.params.tenantId)
    }

    var context = new AuthenticationContext(authorityUrl);

    // use user credentials and appId to get an aad token
    let promise = () => { return new Promise(
        (resolve, reject) => {
            if (config.params.authenticationType === 'MasterUser') {
                context.acquireTokenWithUsernamePassword(config.params.resourceUrl, config.params.username, config.params.password, config.params.appId , function(err, tokenResponse) {
                    if (err) reject(err);
                    resolve(tokenResponse);
                })
            } else {
                context.acquireTokenWithClientCredentials(config.params.resourceUrl, config.params.appId, config.params.clientSecret, function(err, tokenResponse) {
                    if (err) reject(err);
                    resolve(tokenResponse);
                })    
            }
        });
    };

    var res;
    await promise().then(
        tokenResponse => res = tokenResponse
    ).catch(
        err => res = err 
    );

    return res;
}

  module.exports.getAuthenticationToken = getAuthenticationToken;