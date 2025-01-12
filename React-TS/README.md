# Power BI Embedded sample in React framework

## Requirements

1. [Node JS](https://nodejs.org/en/download/)

2. IDE/code editor. We recommend using Visual Studio Code.

## Embed a Power BI report

1. Register an Azure AD app using the [Power BI embedding setup tool](https://app.powerbi.com/embedsetup). For more information see [Register an Azure AD application to use with Power BI](https://docs.microsoft.com/power-bi/developer/embedded/register-app).

2. Verify that your Azure AD app have the **Read all reports** permissions.

3. Go to the AAD app in [Azure portal](https://aka.ms/AppRegistrations) that was created in the previous step and click on "Authentication".

4. Click on Authentication section and set the following configurations in the AAD app:
    * Click "Add a platform", select "Single-page application"
    * Under "Redirect URIs", add http://localhost:3000
    * Under "Implicit grant", check the __Access token__ box
    * Save the changes

## Steps to build and run:

1. Open the IDE.

2. Put required values in the [Config.ts](./Embed%20for%20your%20organization/UserOwnsData/src/Config.ts) file.
To embed a report the following details must be specified within Config.ts:

    | Detail       | Description                                                                 |
    |--------------|-----------------------------------------------------------------------------|
    | clientId     | Id of the AAD application registered as a Server-side app                   |
    | workspaceId  | Id of the Power BI workspace where the report is hosted                     |
    | reportId     | Id of the report to be embedded                                             |

3. Open terminal and install required dependencies by executing the following command:<br>
   `npm install`

4. Execute the below command to start the application:<br>
   `npm run start`

5. Open http://localhost:3000 in browser or refer to logs to check the port on which the application is running.

#### Supported browsers:

1. Google Chrome

2. Microsoft Edge

3. Mozilla Firefox

## Important

For security reasons, in a real world application, passwords and secrets should not be stored in config files. Instead, consider securing your credentials with an application such as Key Vault.
