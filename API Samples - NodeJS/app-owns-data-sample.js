var auth = require(__dirname +'/authentication.js');
var config = require(__dirname + '/config.json');
var utils = require(__dirname + '/utils.js');

async function getReport () {
    res = utils.validateConfig();
    if(res){
       console.log("error: "  + res);
       return;
    }

    tokenResponse = await auth.getAuthenticationToken();
    if(('' + tokenResponse).indexOf('Error') > -1){
        console.log('' + tokenResponse);
        return;
    }
    
    var token = tokenResponse.accessToken;
    console.log("Returned accessToken: " + token);

    var requestParams = utils.createGetReportRequestParams(token)

    return await utils.sendGetReportRequestAsync(requestParams.url, requestParams.options);
}

async function generateEmbedToken(){
    res = utils.validateConfig();
    if(res){
       console.log("error: "  + res);
       return;
    }

    tokenResponse = await auth.getAuthenticationToken();
    if(('' + tokenResponse).indexOf('Error') > -1){
        console.log('' + tokenResponse);
        return;
    }
    
    var token = tokenResponse.accessToken;
    var authHeader = utils.getAuthHeader(token);

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

    return await utils.sendGenerateEmbedTokenRequestAsync(url, options);
}

async function generateEmbedTokenWithRls(username, roles){
    res = utils.validateConfig();
    if(res){
       console.log("error: "  + res);
       return;
    }

    tokenResponse = await auth.getAuthenticationToken();
    if(('' + tokenResponse).indexOf('Error') > -1){
        console.log('' + tokenResponse);
        return;
    }
    
    var token = tokenResponse.accessToken;
    var authHeader = utils.getAuthHeader(token);

    //getting dataset for effective identity
    var reportParams = utils.createGetReportRequestParams(token);
    reportResp = await utils.sendGetReportRequestAsync(reportParams.url, reportParams.options);
    var reportId = reportResp.id;
    var datasetId = reportResp.datasetId;
    var datasetResp = await utils.sendGetDatasetRequestAsync(token, datasetId);

    if(!datasetResp.isEffectiveIdentityRequired){
        console.log("error: the given dataset doesn't support rls");
        return;
    }

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

    return await utils.sendGenerateEmbedTokenRequestAsync(url, options);
}
