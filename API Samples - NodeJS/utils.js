var request = require('request');
var config = require('./config.js');

function getAuthHeader(accessToken) {
    var b = "Bearer ";
    return b.concat(accessToken);
}

function validateConfig() {
    var guid = require('guid');

    if (!["MasterUser", "ServicePrinciple"].includes(config.params.authenticationType)) {
        return "AuthenticationType must be either 'MasterUser' or 'ServicePrinciple'";
    }
    
    if (!config.params.appId) {
        return "ApplicationId is empty. please register your application as Native app in https://dev.powerbi.com/apps and fill client Id in config.js";
    }

    if (!guid.isGuid(config.params.appId)) {
        return "ApplicationId must be a Guid object. please register your application as Native app in https://dev.powerbi.com/apps and fill application Id in config.js";
    }

    if (!config.params.workspaceId) {
        return "WorkspaceId is empty. Please select a group you own and fill its Id in config.js";
    }

    if (!guid.isGuid(config.params.workspaceId)) {
        return "WorkspaceId must be a Guid object. Please select a workspace you own and fill its Id in config.js";
    }

    if (!config.params.reportId) {
        return "ReportId is empty. Please select a report from the workspace";
    }

    if (!guid.isGuid(config.params.reportId)) {
        return "ReportId must be a Guid object";
    }

    if (!config.params.authorityUrl) {
        return "AuthorityUrl is empty. Please fill valid AuthorityUrl under config.js";
    }

    if (config.params.authenticationType === "MasterUser") {
        if (!config.params.username || !config.params.username.trim()) {
            return "Username is empty. Please fill Power BI username in config.js";
        }

        if (!config.params.password || !config.params.password.trim()) {
            return "Password is empty. Please fill password of Power BI username in config.js";
        }
    } else {
        if (!config.params.tenantId) {
            return "TenantId is empty. Please fill your Azure Tenant ID in the config.js";
        }

        if (!guid.isGuid(config.params.appId)) {
            return "TenantId must be a Guid object.";
        }

        if (!config.params.clientSecret) {
            return "ClientSecret is empty. please register your application as Native app in https://dev.powerbi.com/apps and generate a client secret to fill in config.js";
        }

    }
}

function createGetReportRequestParams(accessToken) {
    var authHeader = getAuthHeader(accessToken);
    var headers = {
        'Authorization': authHeader,
    };
    var options = {
        headers: headers,
        method: 'GET',
    };
    var url = config.params.apiUrl + 'v1.0/myorg/groups/' + config.params.workspaceId + '/reports/' + config.params.reportId;

    return {
        'url': url,
        'options': options
    };
}

async function sendGetReportRequestAsync(url, options) {
    let promise = () => {
        return new Promise(
            (resolve, reject) => {
                request(url, options, function (error, response, body) {
                    console.log("-----Get Report Results-----");
                    console.log('Request STATUS: ' + response.statusCode);
                    if (error) {
                        reject(error);
                    }
                    if (body == "") {
                        console.log('error: no report with id: ' + config.params.reportId + " in group with id: " + config.params.workspaceId);
                        reject('error: no report with id: ' + config.params.reportId + " in group with id: " + config.params.workspaceId);
                    }
                    try {
                        getReportRes = JSON.parse(body)
                        if (config.params.reportId) {
                            console.log("Returned report name: " + getReportRes.name);
                            console.log("Returned report Id: " + getReportRes.id);
                            resolve(getReportRes);
                        } else {
                            if (getReportRes.value.length == 0) {
                                console.log('No reports in the given workspace');
                                reject('error: No reports in the given workspace');
                            } else {
                                console.log("Returned report name: " + getReportRes.value[0].name);
                                console.log("Returned report Id: " + getReportRes.value[0].id);
                                resolve(getReportRes.value[0]);
                            }
                        }
                    } catch (e) { }
                });
            });
    }

    var res;
    await promise().then(
        reportResponse => res = reportResponse
    ).catch(
        err => res = err
    );
    return res;
}

async function sendGenerateEmbedTokenRequestAsync(url, options) {
    let promise = () => {
        return new Promise(
            (resolve, reject) => {
                request(url, options, function (error, response, body) {
                    console.log("-----Generate EmbedToken Results-----");
                    console.log('Request STATUS: ' + response.statusCode);
                    if (error) {
                        reject(error);
                    }

                    if (body == '') {
                        console.log('error: no report with id: ' + config.params.reportId + " in group with id: " + config.params.workspaceId);
                        reject('error: no report with id: ' + config.params.reportId + " in group with id: " + config.params.workspaceId);
                    }

                    if (JSON.parse(body).error) {
                        console.log(body)
                        reject(JSON.parse(body).error);
                    }

                    try {
                        generateEmbedTokenRes = JSON.parse(body)
                        if (config.params.reportId) {
                            console.log('Token Generated: ' + generateEmbedTokenRes.token);
                            resolve(generateEmbedTokenRes.token);
                        } else {
                            console.log('Token Generated: ' + generateEmbedTokenRes.token);
                            resolve(generateEmbedTokenRes.token);
                        }
                    } catch (e) { }
                });
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

async function sendGetDatasetRequestAsync(token, datasetId) {
    authHeader = getAuthHeader(token);
    var headers = {
        'Authorization': authHeader,
    };
    var options = {
        headers: headers,
        method: 'GET',
    };
    var url = config.apiUrl + 'v1.0/myorg/groups/' + config.workspaceId + '/datasets/' + datasetId;

    let promise = () => {
        return new Promise(
            (resolve, reject) => {
                request(url, options, function (error, response, body) {
                    console.log('Get dataset request STATUS: ' + response.statusCode);
                    if (error) {
                        reject(error);
                    }
                    try {
                        dataset = JSON.parse(body)
                        resolve(dataset);
                    } catch (e) {
                        reject(e)
                    }
                });
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

module.exports = {
    getAuthHeader: getAuthHeader,
    validateConfig: validateConfig,
    createGetReportRequestParams: createGetReportRequestParams,
    sendGetReportRequestAsync: sendGetReportRequestAsync,
    sendGenerateEmbedTokenRequestAsync: sendGenerateEmbedTokenRequestAsync,
    sendGetDatasetRequestAsync: sendGetDatasetRequestAsync,
}