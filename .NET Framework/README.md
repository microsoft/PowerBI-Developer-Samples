# Power BI Embedded Sample in .NET Framework

Read this documentation to prepare your environment: https://aka.ms/EmbedForCustomer

# Embed for your customers

## Choose Authentication method

In web.config:

- For authentication with master user credential choose MasterUser as AuthenticationType. Register an app [here](https://aka.ms/embedsetup/appownsdata)

- For authentication with app secret choose ServicePrincipal as AuthenticationType. For more details refer to https://aka.ms/EmbedServicePrincipal

To embed reports, dashboards and tiles, the following details must be specified within web.config:

| Detail            | Description                                                                                           |
|-------------------|-------------------------------------------------------------------------------------------------------|
| applicationId     | Id of the AAD application registered as a Native app.                                                 |
| workspaceId       | The group or workspace Id in Power BI containing the reports, dashboards and tiles you want to embed. |
| pbiUsername       | A Power BI username (e.g. Email). The user must be an admin of the group above. (For Master User only)|
| pbiPassword       | The password of the Power BI user above. (For Master User only)                                       |
| applicationSecret | Secret Key of the AAD application registered as a Server-side web app. (For Service Principal only)            |
| tenant            | Tenant Id of the application. (For Service Principal Only)                                            |

Following permissions need to be configured in the AAD app:

1. Report.Read.All
2. Dashboard.Read.All

# Embed for your organization

## Source code for integrate a report / dashboard / tile into an app walkthrough

Integrate Power BI elements from a user's Power BI account by embedding an IFrame into an app, such as a mobile app or web app.

See [Integrate a report into an app walkthrough](https://aka.ms/EmbedForOrg).

Follow these steps to run PowerBI.com Integrate samples:


## Step 1 - App Registration

1. Register an application to be used to call Power BI APIs using the [Embed Setup Tool](https://aka.ms/embedsetup/UserOwnsData)
2. Enable Access token option under “Implicit grant” in Authentication section of AAD app

### Registration parameters per sample

Redirect URL  - http://localhost:13526/Redirect

Home Page URL - http://localhost:13526/

### App permissions to be configured in AAD app

1. Report.Read.All
2. Dashboard.Read.All

Registration Example:

![regexample](https://cloud.githubusercontent.com/assets/23071967/23340723/fc032efe-fc43-11e6-9a8f-13e40cb32d97.png)

## Step 2 - Change Cloud.config

Copy Client Id and Client secret to Cloud.config file

![regexample](https://cloud.githubusercontent.com/assets/23071967/23340740/48d4f640-fc44-11e6-8f31-dd273d26a61e.png)

## Important

For security reasons, in a real world application, password or secret should not be stored in config. Instead, consider securing credentials with an application such as Key Vault.


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