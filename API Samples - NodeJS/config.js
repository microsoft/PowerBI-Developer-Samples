
require('dotenv').config()

const params = {
    "authorityUrl": "https://login.microsoftonline.com/common/",
    "resourceUrl": "https://analysis.windows.net/powerbi/api",
    "apiUrl": "https://api.powerbi.com/",
    "appId": process.env.CLIENT_ID,
    "workspaceId": process.env.WORKSPACE_ID,
    "reportId": process.env.REPORT_ID,
    "username": process.env.PBI_USERNAME, // Needed for MasterUser auth type
    "password": process.env.PBI_PASSWORD, // Needed for MasterUser auth type
    "tenantId": process.env.TENANT_ID, // Needed for ServicePrinciple auth type
    "clientSecret": process.env.CLIENT_SECRET, // Needed for ServicePrinciple auth type
    "authenticationType": "ServicePrinciple" // or 'MasterUser'
};

exports.params = params;

