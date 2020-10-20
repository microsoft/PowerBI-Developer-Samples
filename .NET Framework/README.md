# Power BI Embedded Sample in .NET Framework

## Requirements

1. [.NET Framework 4.8 Dev Pack](https://aka.ms/dotnet48)

2. IDE/ Code Editor (Recommended is Visual Studio)

# Embed for your customers

## Set up a Power BI app

1. For Master user, register a Native app [here](https://aka.ms/embedsetup/AppOwnsData) and for Service Principal, register a Server-side web app by following [this](https://aka.ms/EmbedServicePrincipal).

2. Select "Read all workspaces", "Read all datasets", "Read all reports", "Read all dashboards" permissions during Power BI app setup. Refer to the [documentation](https://aka.ms/RegisterPowerBIApp) for registering a Power BI app. 

    Refer to the [documentation](https://aka.ms/PowerBIPermissions) for the complete list of Power BI permissions.

## Run the application on localhost

1. Open the [PowerBIEmbedded_AppOwnsData.sln](Embed%20for%20your%20customers/PowerBIEmbedded_AppOwnsData.sln) file in Visual Studio.

2. Fill in the required parameters in [Web.config](Embed%20for%20your%20customers/PowerBIEmbedded_AppOwnsData/Web.config) file.

3. Build and run the application.

# Embed for your organization

## Set up a Power BI app

1. Register a Server-side web app [here](https://aka.ms/embedsetup/userownsdata). Refer to the [documentation](https://aka.ms/PowerBIPermissions) for the complete list of Power BI permissions.

2. Select "Read all workspaces", "Read all reports" and "Read all dashboards" permissions during Power BI app setup.
   
3. Go to the AAD app in [Azure portal](https://aka.ms/AppRegistrations) that was created in the previous step and click on "Authentication".

4. Under "Redirect URIs", add https://localhost:44300/

## Run the application on localhost

1. Open the [DotNetFrameworkSaaS.sln](Embed%20for%20your%20organization\DotNetFrameworkSaaS.sln) file in Visual Studio.

2. Fill in the required parameters in [Web.config](Embed%20for%20your%20organization\DotNetFrameworkSaaS\Web.config) file related to AAD app.

3. Build and run the application.

## Supported browsers:

1. Google Chrome
   
2. Microsoft Edge Chromium

3. Mozilla Firefox

## Important

For security reasons, in a real world application, password or secret should not be stored in config. Instead, consider securing credentials with an application such as Key Vault.