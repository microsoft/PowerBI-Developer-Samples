var auth = require(__dirname +'/authentication.js');
var config = require(__dirname + '/config.json');
var utils = require(__dirname + '/utils.js');

async function getReport () {
    // validate configuration info
    res = utils.validateConfig();
    if(res){
       console.log("error: "  + res);
       return;
    }

    // get aad token to use for sending api requests
    tokenResponse = await auth.getAuthenticationToken();
    if(('' + tokenResponse).indexOf('Error') > -1){
        console.log('' + tokenResponse);
        return;
    }
    
    var token = tokenResponse.accessToken;
    console.log("Returned accessToken: " + token);

    // create reqest for GetReport api call
    var requestParams = utils.createGetReportRequestParams(token)

    // get the requested report from the requested api workspace.
    // if report not specified - returns the first report in the workspace.
    // the request's results will be printed to console.
    return await utils.sendGetReportRequestAsync(requestParams.url, requestParams.options);
}

async function generateEmbedToken(){
    // validate configuration info
    res = utils.validateConfig();
    if(res){
       console.log("error: "  + res);
       return;
    }

    // get aad token to use for sending api requests
    tokenResponse = await auth.getAuthenticationToken();
    if(('' + tokenResponse).indexOf('Error') > -1){
        console.log('' + tokenResponse);
        return;
    }
    
    var token = tokenResponse.accessToken;
    var authHeader = utils.getAuthHeader(token);

    // get report id to use in GenerateEmbedToken requestd
    var reportId;
    if(!config.reportId){
        console.log("Getting default report from workspace for generating embed token...")

        var reportParams = utils.createGetReportRequestParams(token)
        reportResp = await utils.sendGetReportRequestAsync(reportParams.url, reportParams.options);
        if(!reportResp) {
            return;
        }
        reportId = reportResp.id
    } else{
        reportId = config.reportId;
    } 

    var headers = {
        'Authorization': authHeader,
        'Content-Type': 'application/json',        
    };

    var options = {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({"accessLevel": "View"})
    };

    var url = config.apiUrl + 'v1.0/myorg/groups/' + config.workspaceId + '/reports/' + reportId + '/GenerateToken';

    // generate powerbi embed token to use for embed report.
    // the returned token will be printed to console.
    return await utils.sendGenerateEmbedTokenRequestAsync(url, options);
}

async function generateEmbedTokenWithRls(username, roles){
    // validate configuration info
    res = utils.validateConfig();
    if(res){
       console.log("error: "  + res);
       return;
    }

    // get aad token to use for sending api requests
    tokenResponse = await auth.getAuthenticationToken();
    if(('' + tokenResponse).indexOf('Error') > -1){
        console.log('' + tokenResponse);
        return;
    }
    
    var token = tokenResponse.accessToken;
    var authHeader = utils.getAuthHeader(token);

    // getting report id to use in GenerateEmbedToken requestd
    var reportParams = utils.createGetReportRequestParams(token);
    reportResp = await utils.sendGetReportRequestAsync(reportParams.url, reportParams.options);
    var reportId = reportResp.id;

    //getting dataset for effective identity
    var datasetId = reportResp.datasetId;
    var datasetResp = await utils.sendGetDatasetRequestAsync(token, datasetId);

    if(!datasetResp.isEffectiveIdentityRequired){
        console.log("error: the given dataset doesn't support rls");
        return;
    }

    // creating effective identity
    var identities = [
        {
            'username' : username,
            'roles' : roles,
            'datasets' : [datasetId]
        }
    ];

    var body = {
        "accessLevel": "View",
        "identities": identities
    }

    var headers = {
        'Authorization': authHeader,
        'Content-Type': 'application/json',       
    };

    var options = {
            headers: headers,
            method: 'POST',
            body: JSON.stringify(body)
    };

    var url = config.apiUrl + 'v1.0/myorg/groups/' + config.workspaceId + '/reports/' + reportId + '/GenerateToken';

    // generate powerbi embed token, with the specified effective identity, to use for embed report.
    // the returned token will be printed to console.
    return await utils.sendGenerateEmbedTokenRequestAsync(url, options);
}