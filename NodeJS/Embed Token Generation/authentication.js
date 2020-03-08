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

    var config = require(__dirname + '/config.json');

    var authorityUrl = config.authorityUrl

    var casjson = fs.readFileSync(__dirname + '/cas.json');
    var cas = JSON.parse(casjson);
    https.globalAgent.options.ca = cas;

    var context = new AuthenticationContext(authorityUrl);

    let promise = () => { return new Promise(
        (resolve, reject) => {
            context.acquireTokenWithUsernamePassword(config.resourceUrl, config.username, config.password, config.appId , function(err, tokenResponse) {
                if (err) reject(err);
                resolve(tokenResponse);
            })
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