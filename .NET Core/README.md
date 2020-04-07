# Power BI Embedded Sample in .NET Core

## App Owns Data

### Requirements

1. [.NET Core 3.1 SDK](https://aka.ms/netcore31)

2. IDE (Recommended is Visual Studio Code or Visual Studio 2019)

  

### Embed a Power BI report

1. For Master user, register a Native app [here](https://aka.ms/embedsetup/AppOwnsData) and for Service Principal, register a Server-side web app by following [this](https://aka.ms/EmbedServicePrincipal). Refer to [documentation](https://aka.ms/RegisterPowerBIApp).

2. Put required values in the [appsettings.json](App%20Owns%20Data/DotNetCorePaaS/appsettings.json) file related to AAD app, Power BI report, workspace, and user account information. Refer [ConfigurationModel.cs](App%20Owns%20Data/DotNetCorePaaS/Models/ConfigurationModel.cs) for more info on config parameters.

  

### Run the application on localhost

1. Open the [DotNetCorePaaS.sln](App%20Owns%20Data/DotNetCorePaaS.sln) file in Visual Studio 2019. If you are using Visual Studio Code then, open [DotNetCorePaaS](App%20Owns%20Data/DotNetCorePaaS) folder.

2. Populate [appsettings.json](App%20Owns%20Data/DotNetCorePaaS/appsettings.json) file.

3. Build and run the application.



## User Owns Data

1. To embed reports, dashboards and tiles, the following details must be specified within [appsettings.json](User%20Owns%20Data/NetCore-Sample/appsettings.json):

    | Detail        | Description                                                                                           |
    |---------------|-------------------------------------------------------------------------------------------------------|
    | applicationId | Id of the AAD application registered as a NATIVE app.                                                 |
    | groupId   | The group or workspace Id in Power BI containing the reports, dashboards and tiles you want to embed. |

2. Build and run the application

## Important

For security reasons, in a real world application, password or secret should not be stored in config. Instead, consider securing credentials with an application such as Key Vault.
