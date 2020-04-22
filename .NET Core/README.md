# Power BI Embedded Sample in .NET Core

## Requirements

1. [.NET Core 3.1 SDK](https://aka.ms/netcore31)

2. IDE (Recommended is Visual Studio Code or Visual Studio 2019)
<br>
**Note:** Visual Studio version >=16.5 is required to use .NET Core SDK 3.1


## App Owns Data

### Embed a Power BI report

For Master user, register a Native app [here](https://aka.ms/embedsetup/AppOwnsData) and for Service Principal, register a Server-side web app by following [this](https://aka.ms/EmbedServicePrincipal). Refer to [documentation](https://aka.ms/RegisterPowerBIApp).

### Run the application on localhost

1. Open the [DotNetCorePaaS.sln](App%20Owns%20Data/DotNetCorePaaS.sln) file in Visual Studio 2019. If you are using Visual Studio Code then, open [DotNetCorePaaS](App%20Owns%20Data/DotNetCorePaaS) folder.

2. Populate [appsettings.json](App%20Owns%20Data/DotNetCorePaaS/appsettings.json) file. Refer [ConfigurationModel.cs](App%20Owns%20Data%2FDotNetCorePaaS%2FModels%2FConfigurationModel.cs) for more info on config parameters.

3. Build and run the application.



## User Owns Data

### Embed a Power BI report

1. Register a Server-side web app [here](https://aka.ms/embedsetup/userownsdata).
   
2. After an AAD app is created in the Azure Portal, check the Access token checkbox in the Authentication section under "Implicit grant".

### Run the application on localhost

1. Open the [DotNetCoreSaaS.sln](User%20Owns%20Data/DotNetCoreSaaS.sln) file in Visual Studio 2019. If you are using Visual Studio Code then, open [DotNetCoreSaaS](User%20Owns%20Data/DotNetCoreSaaS) folder.

2. Populate [authConfig.js](User%20Owns%20Data/DotNetCoreSaaS/wwwroot/js/authConfig.js) file.

3. Build and run the application.

#### Note: This sample application has been tested on the following browsers

1. Google Chrome
   
2. Microsoft Edge Chromium

3. Mozilla Firefox

4. Internet Explorer

## Important

For security reasons, in a real world application, password or secret should not be stored in config. Instead, consider securing credentials with an application such as Key Vault.
