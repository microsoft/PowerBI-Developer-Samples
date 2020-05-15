# Power BI Embedded Sample in Node JS

## Embed for your customers

### Requirements
   
1. [Node JS](https://nodejs.org/en/download/)
   
2. IDE/ Code Editor (Recommended is Visual Studio Code)

### Set up a Power BI app

1. For Master user, register a Native app [here](https://aka.ms/embedsetup/AppOwnsData) and for Service Principal, register a Server-side web app by following [this](https://aka.ms/EmbedServicePrincipal).

2. Select "Read all datasets" and "Read all reports" permissions during Power BI app setup. Refer to the [documentation](https://aka.ms/RegisterPowerBIApp) for registering a Power BI app. 

   Refer to the [documentation](https://aka.ms/PowerBIPermissions) for the complete list of Power BI permissions.

### Run the application on localhost

1. Open IDE.
 
2. Open [App Owns Data](Embed%20for%20your%20customers) folder.

3. Open terminal and install required dependencies by executing the following command.<br>
   `npm install`
   
4. Fill in the required parameters in [config.json](Embed%20for%20your%20customers/config/config.json) file related to AAD app, Power BI report, workspace, and user account information.

5. Run the following command in CMD/PowerShell to start the application.<br>
   `npm start`

6. Open **http://localhost:5300** in browser or refer to logs to check the port on which the application is running.

## Important

For security reasons, in a real world application, password or secret should not be stored in config. Instead, consider securing credentials with an application such as Key Vault.
