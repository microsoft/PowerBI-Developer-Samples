# Power BI Embedded Sample in Node JS



### Requirements

1. Node JS

2. IDE (Recommended is Visual Studio Code)

  

### Embed a Power BI report

1. Refer to the [documentation](https://aka.ms/RegisterPowerBIApp) and register a Power BI app [here](https://app.powerbi.com/apps).

2. Put required values in the [config.json](App%20Owns%20Data/config.json) file related to AAD app, Power BI report, workspace, dataset, and user account information.

3. Save and restart the application.

  

### Run the application to generate Embed token

1. Open Visual Studio Code.

2. Open _NodeJS/App_Owns_Data_ folder.

3. Open integrated terminal and type the below command to start the application.<br>
   `node app-owns-data-sample.js`

4. See the output logs for generated Embed token.