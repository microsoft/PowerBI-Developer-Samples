# API Sample - .Net Core 2.0

This is a basic UserOwnsData based sample for embed report api.

You can either register a server-side web application to run the sample or use the default public app already in the solution.

If you decide to use your registered app, use the following parameters:

Redirect URL  - http://localhost:21638

Home Page URL - http://localhost:21638

Change the ApplicationId in the appsettings.json file.

Build and Run the sample (if you are using the default app just build and run without changing the ApplicationId).

## Using AppOwnData with .Net Core 2.0

For using AppOwnsData, you need to obtain an embed token,

you can use the following code (from the [AppOwnsData sample](https://github.com/Microsoft/PowerBI-Developer-Samples/tree/master/App%20Owns%20Data)):

 ```c#
var tokenCredentials = new TokenCredentials(authenticationResult.AccessToken, "Bearer");
using (var client = new PowerBIClient(new Uri(ApiUrl), tokenCredentials))
  {
    GenerateTokenRequest generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
    var tokenResponse = await client.Reports.GenerateTokenInGroupAsync(WorkspaceId, report.Id, generateTokenRequestParameters);
  }
```
