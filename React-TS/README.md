# Power BI Embedded sample in React framework

## Requirements
* [Node JS](https://nodejs.org/en/download/)
* IDE
	
## Embed a Power BI report
1. Register a Server-side web app [here](https://aka.ms/embedsetup/userownsdata) with 'Read all reports' permissions. For more info, refer [documentation](https://aka.ms/RegisterPowerBIApp)
<br>
Select the required permissions while registering the app. Complete list of Power BI API permissions is available [here](https://aka.ms/PowerBIPermissions).
2. Navigate to  [App registrations in the Azure portal](https://aka.ms/AppRegistrations) and click on the name of the AAD app registered in the previous step.
3. Click on Authentication section and set the following configurations in the AAD app:
    * In Redirect URIs, add http://localhost:3000 
    * Under "Implicit grant", check the __Access token__ box  
    * Save the changes



## Steps to build and run:

1. Open the IDE

2. Put required values in the [Config.ts](Embed%20for%20your%20organization\src\Config.ts) file:
To embed a report the following details must be specified within Config.ts:

    | Detail       | Description                                                                 |
    |--------------|-----------------------------------------------------------------------------|
    | clientId     | Id of the AAD application registered as a Server-side app                   |
    | workspaceId  | Id of the Power BI workspace where the report is hosted  |
    | reportId     | Id of the report to be embedded                                             |

3. Open terminal and install required dependencies by executing the following command:<br>
   `npm install`

4. Execute the below command to start the application:<br>
   `npm run start`

5. Open http://localhost:3000 in browser or refer to logs to check the port on which the application is running

#### Supported browsers:

1. Google Chrome
   
2. Microsoft Edge Chromium

3. Mozilla Firefox

4. Internet Explorer

## Important

For security reasons, in a real world application, password or secret should not be stored in config. Instead, consider securing credentials with an application such as Key Vault.