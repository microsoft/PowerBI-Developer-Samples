# Power BI Embedded sample in ANGULAR

## The application
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

The application allows authentication with AZURE AD through Microsoft's MSAL library. The token obtained from AZURE AD
can then be used to visualize Power BI dashboards, reports or tiles.


## Requirements
1. [Node.js](https://nodejs.dev/learn/how-to-install-nodejs)
2. ANGULAR CLI should be installed through ``npm install @angular/cli``.
3. Deployment of all Node.js packages refereenced in package.json: ``npm install``


## Register your application
Follow the instructions to register a [single-page application](https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-app-registration) in the Azure portal:
- On the app Overview page of your registration, note the **Application (client) ID** value for later use. The ID needs to be configured in this application to allow authentication.
- As application type, select 'SPA'.
- As **Redirect URI** value enter the URL when you will be hosting this application (e.g. https://powerbiapp.mycompany.com). For local development using ``ng serve``, the value should be http://localhost:4200/.

Note the AZURE AD tenant ID, since it needs to be configured in this application.

## Authentication configuration
The configuration in the file **app.module.ts** must be updated with the ID's obatained the previous step as well as the redirect URL:
```typescript
MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: '<APPLICATION ID>',
        authority: 'https://login.microsoftonline.com/<AZURE AD TENANT ID>',
        redirectUri: '<APPLICATION REDIRECT URL>',
      },
```


## Build the application
Execute ``ng build --prod`` to build the application.  The build artifacts will be stored in the `dist/` directory. This folder can be deployed on the hosting infrastructure.
