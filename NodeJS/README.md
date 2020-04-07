# Power BI Embedded Sample in Node JS

## App Owns Data

### Requirements
   
1. [Node JS](https://nodejs.org/en/download/)
   
2. IDE 

### Embed a Power BI report

1. For Master user, register a Native app [here](https://aka.ms/embedsetup/AppOwnsData). Refer to [documentation](https://aka.ms/RegisterPowerBIApp).

2. Put required values in the [config.json](App%20Owns%20Data/config/config.json) file related to AAD app, Power BI report, workspace, and user account information.

### Run the application on localhost

1. Open IDE.
 
2. Open *NodeJS/App Owns Data* folder.

3. Open terminal and install required dependencies by executing the following command.<br>
   `npm install`
   
4. Execute the below command to start the application.<br>
   `npm start`

5. Open **localhost:5300** in browser or refer to logs to check the port on which the application is running.

## Important

For security reasons, in a real world application, password or secret should not be stored in config. Instead, consider securing credentials with an application such as Key Vault.
