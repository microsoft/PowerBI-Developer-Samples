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
