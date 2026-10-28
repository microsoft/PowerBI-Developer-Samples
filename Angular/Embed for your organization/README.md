# Power BI Embedded sample in ANGULAR

## The application
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

The application allows authentication with AZURE AD through Microsoft's MSAL library. The token obtained from AZURE AD
can then be used to visualize Power BI dashboards, reports or tiles.


## Requirements
1. [Node.js](https://nodejs.dev/learn/how-to-install-nodejs)
2. ANGULAR CLI should be installed through ``npm install -g @angular/cli``.
3. Deployment of all Node.js packages referenced in package.json: from the folder containing this README.md file, execute ``npm install``.

## Register your application
Follow the instructions to register a [single-page application](https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-app-registration) in the Azure portal:
- Enter a name.
- Select the "supported account type".
- Under "redirect URI" select "Single-page application (SPA)". As **Redirect URI** value enter the URL when you will be hosting this application:
  - For local development using ``ng serve``, the value should be http://localhost:4200/.
  - When hosting on e.g. AZURE App Services, enter the URL of the application (https://<APP-NAME>.azurewebsites.net or a custom domain name assigned to the app).
- After registering the application, note the **Application (Client) ID**  and **Directory (Tenant) ID** values on the "Overview" blade for later use.
- Select the "API Permissions" blade and add permission for the "Power BI Service" (Delegated permissions). Enable all required permissions.


## Authentication configuration
The configuration in the file **app.module.ts** must be updated with the ID's obtained from the previous step:
```typescript
MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: '<APPLICATION ID>',
        authority: 'https://login.microsoftonline.com/<AZURE AD TENANT ID>'
      },
```


## Build the application
Execute ``ng build --prod`` to build the application.  The build artifacts will be stored in the `dist/UserOwnsData` directory. This folder can be deployed on the hosting infrastructure.


## Application source structure
The application leverages the ANGULAR framework. The application as such is implemented in the home component (selecting workspaces, reports, ... as well as visualizing these). Securing the application and authentication with AZURE AD is handled through the Microsoft MSAL libary. Microsoft provides an ANGULAR library to integrate the MSAL functionality into the framework. The ``app.module.ts`` file configures the ``MsalGuard`` to protect access to the home component. ``MsalInterceptor`` is used to automatically insert an access-token into API calls made using ANGULAR's ``HttpClient``. If no token is available, an authentication popup will be displayed. Tokens get renewed automatically by the MSAL library. 

When embedding a report, the access-token needs to be included in the request to the Power BI Embedded endpoint. The code uses the MSAL ``AcquireTokenSilent`` method to obtain the token (with scope: https://analysis.windows.net/powerbi/api/.default). This access token is then added into the configuration structure passed to the ``powerbi.embed`` function to load and render the report.

The user-profile is queried from AZURE AD by the "user-profile service" over the MS Graph API.