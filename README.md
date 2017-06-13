# App Owns Data samples

Read this documentation to prepare your environment
https://powerbi.microsoft.com/en-us/documentation/powerbi-developer-using-embed-token/

To see embedded report, dashboard and tile, you need to fill missing details in web.config.

clientId - Id of AAD application registered as native app.

groupId - group or workspace Id in Power BI which contains reports, dashboards and tiles you want to embed.

pbiUsername - Power BI username (e.g. Email). Must be an admin of the group above.

pbiPassword - password of Power BI user above.

### Important

For security reasons, in real application, don't save the user and password in web.config. Consider using KeyVault

# User Owns Data samples

Please follow these steps to run PowerBI.com Integrate samples:
## Step 1 - App Registration
You need to register an application in
https://dev.powerbi.com/apps

### Registration parameters per sample

#### integrate-dashboard-web-app
Redirect URL  - http://localhost:13526/Redirect

Home Page URL - http://localhost:13526/

#### integrate-report-web-app
Redirect URL  - http://localhost:13526/

Home Page URL - http://localhost:13526/

#### integrate-tile-web-app
Redirect URL  - http://localhost:13526/

Home Page URL - http://localhost:13526/

Registration Example:

![regexample](https://cloud.githubusercontent.com/assets/23071967/23340723/fc032efe-fc43-11e6-9a8f-13e40cb32d97.png)

## Step 2 - Change Web.config
Copy Client Id and Client secret to web.config file

![regexample](https://cloud.githubusercontent.com/assets/23071967/23340740/48d4f640-fc44-11e6-8f31-dd273d26a61e.png)



