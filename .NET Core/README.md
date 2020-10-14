# Power BI Embedded Sample in .NET Core

## Requirements

1. [.NET Core 3.1 SDK](https://aka.ms/netcore31)

2. IDE/ Code Editor (Recommended is Visual Studio Code or Visual Studio 2019)
<br>
**Note:** Visual Studio version >=16.5 is required to use .NET Core SDK 3.1


## Embed for your customers

### Set up a Power BI app

1. For Master user, register a Native app [here](https://aka.ms/embedsetup/AppOwnsData) and for Service Principal, register a Server-side web app by following [this](https://aka.ms/EmbedServicePrincipal).

    Select "Read all datasets" and "Read all reports" permissions during Power BI app setup. Refer to the [documentation](https://aka.ms/RegisterPowerBIApp) for registering a Power BI app. 
    
    Refer to the [documentation](https://aka.ms/PowerBIPermissions) for the complete list of Power BI permissions.

### Run the application on localhost

1. Open the [DotNetCorePaaS.sln](Embed%20for%20your%20customers/DotNetCorePaaS.sln) file in Visual Studio 2019. If you are using Visual Studio Code then, open [DotNetCorePaaS](Embed%20for%20your%20customers/DotNetCorePaaS) folder.

2. Fill in the required parameters in [appsettings.json](Embed%20for%20your%20customers/DotNetCorePaaS/appsettings.json) file. Refer to [ConfigurationModel.cs](Embed%20for%20your%20customers/DotNetCorePaaS/Models/ConfigurationModel.cs) for more info on the config parameters.

3. Build and run the application.


## Embed for your organization

### Set up a Power BI app

1. Register a Server-side web app [here](https://aka.ms/embedsetup/userownsdata). Refer to the [documentation](https://aka.ms/PowerBIPermissions) for the complete list of Power BI permissions.
   
2. Go to the AAD app in [Azure portal](https://aka.ms/AppRegistrations) that was created in the previous step and click on "Authentication".
   
3. Under "Implicit grant", enable the Access token option.

4. Under "Redirect URIs", add https://localhost:5000

### Run the application on localhost

1. Open the [DotNetCoreSaaS.sln](Embed%20for%20your%20organization/DotNetCoreSaaS.sln) file in Visual Studio 2019. If you are using Visual Studio Code then, open [DotNetCoreSaaS](Embed%20for%20your%20organization/DotNetCoreSaaS) folder.

2. Fill in the required parameters in [appsettings.json](Embed%20for%20your%20organization/DotNetCoreSaaS/appsettings.json) file related to AAD app.

3. Build and run the application.

#### Supported browsers:

1. Google Chrome
   
2. Microsoft Edge Chromium

3. Mozilla Firefox

## Important

For security reasons, in a real world application, password or secret should not be stored in config. Instead, consider securing credentials with an application such as Key Vault.
