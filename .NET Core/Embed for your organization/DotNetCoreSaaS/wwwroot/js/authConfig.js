// Refer https://aka.ms/MsalSpa to understand the process of authentication using MSAL
var authConfig = {

    // Enter Tenant Id in place of common for single tenant AAD apps
    authority: "https://login.microsoftonline.com/common",

    // Enter AAD app's Client Id
    clientId: "",

    // Enter absolute URL of Redirect page
    redirectUri: "https://localhost:5000/",

    // Array of scopes required for consent and resource access
    scopes: ["https://analysis.windows.net/powerbi/api/Workspace.Read.All",
        "https://analysis.windows.net/powerbi/api/Report.Read.All",
        "https://analysis.windows.net/powerbi/api/Dashboard.Read.All"]
}