# Power BI Embedded sample in Node JS

## Embed for your customers

### Requirements

1. [Node JS](https://nodejs.org/en/download/)
   
2. IDE/code editor. We recommend using Visual Studio Code.

### Set up a Power BI app

Follow the steps on [aka.ms/EmbedForCustomer](https://aka.ms/embedforcustomer)

### Run the application on localhost

1. Open IDE.
 
2. Open [AppOwnsData](./Embed%20for%20your%20customers/AppOwnsData) folder.

3. Open terminal and install required dependencies by executing the following command.<br>
   `npm install`
   
4. Fill in the required parameters in the [config.json](./Embed%20for%20your%20customers/AppOwnsData/config/config.json) file related to AAD app, Power BI report, workspace, and user account information.

5. Run the following command in CMD/PowerShell to start the application.<br>
   `npm start`

6. Open **http://localhost:5300** in browser or refer to logs to check the port on which the application is running.

#### Supported browsers:

1. Google Chrome

2. Microsoft Edge

3. Mozilla Firefox

## Important

For security reasons, in a real world application, passwords and secrets should not be stored in config files. Instead, consider securing your credentials with an application such as Key Vault.
