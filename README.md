[![Build Status](https://powerbi.visualstudio.com/Embedded/_apis/build/status/Devolper-Samples-Azure%20Web%20App%20for%20ASP.NET-CI?branchName=master)](https://powerbi.visualstudio.com/Embedded/_build/latest?definitionId=2824&branchName=master)

# App Owns Data samples

Read this documentation to prepare your environment
https://docs.microsoft.com/en-us/power-bi/developer/embedding-content

To embed reports, dashboards and tiles, the following details must be specified within web.config:

| Detail        | Description                                                                                           |
|---------------|-------------------------------------------------------------------------------------------------------|
| applicationId | Id of the AAD application registered as a NATIVE app.                                                 |
| workspaceId   | The group or workspace Id in Power BI containing the reports, dashboards and tiles you want to embed. |
| pbiUsername   | A Power BI username (e.g. Email). The user must be an admin of the group above.                       |
| pbiPassword   | The password of the Power BI user above.                                                              |

## Important

For security reasons, in a real application, the user and password should not be saved in web.config. Instead, consider securing credentials with an application such as KeyVault.

# User Owns Data samples

Follow these steps to run PowerBI.com Integrate samples:


## Step 1 - App Registration

Register an application to be used to call Power BI APIs using the [Embed Setup Tool](https://app.powerbi.com/embedsetup/UserOwnsData)

### Registration parameters per sample

Redirect URL  - http://localhost:13526/Redirect

Home Page URL - http://localhost:13526/

Registration Example:

![regexample](https://cloud.githubusercontent.com/assets/23071967/23340723/fc032efe-fc43-11e6-9a8f-13e40cb32d97.png)

## Step 2 - Change Cloud.config

Copy Client Id and Client secret to Cloud.config file

![regexample](https://cloud.githubusercontent.com/assets/23071967/23340740/48d4f640-fc44-11e6-8f31-dd273d26a61e.png)

## Troubleshooting

### Visual Studio 2013
To resolve a 'CS0012:Predefined type 'System.Object' is not defined or imported' error, please update web.config.

Find line:
 ```xml
 <compilation debug="true" targetFramework="4.5"/>
 ```
 
 And modify it to:
 
 ```xml
 <compilation debug="true" targetFramework="4.5">
  <assemblies>     
    <add assembly="System.Runtime, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" />   
  </assemblies>
</compilation>
```

## Issues
[Power BI Support Page](https://powerbi.microsoft.com/en-us/support/)

[Power BI Ideas](https://ideas.powerbi.com)

# API Sample - .Net Core 2.0
A basic UserOwnsData based sample for embed report api.

You can either register a native app to run the sample or use the default public app already in the solution.

If you decide to use your registered app, use the following parameters:

Redirect URL  - http://localhost:21638

Home Page URL - http://localhost:21638

Change the ApplicationId in the the appsettings.json file.

Build and Run the sample (if you are using the default app just build and run).

# API Sample - NodeJS
Contains several API calls samples for App Owns Data.

After registering an app (as described under "App Owns Data Sample").

Fill config parameters under config.json.

Use one of the methods in app-owns-data-sample.js to make the coresponding api call.
