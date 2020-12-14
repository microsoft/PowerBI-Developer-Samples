# Power BI Embedded sample in .NET Core

## Requirements

1. [.NET Core 3.1](https://aka.ms/netcore31) SDK or higher.

2. IDE/code editor. We recommend using Visual Studio Code or Visual Studio 2019 (or a later version).
<br>
> **Note:** Visual Studio version >=16.5 is required to use .NET Core SDK 3.1.


## Embed for your customers

### Set up a Power BI app

Follow the steps on [aka.ms/EmbedForCustomer](https://aka.ms/embedforcustomer)

### Run the application on localhost

1. Open the [AppOwnsData.sln](./Embed%20for%20your%20customers/AppOwnsData.sln) file in Visual Studio. If you are using Visual Studio Code then, open [AppOwnsData](./Embed%20for%20your%20customers/AppOwnsData) folder.

2. Fill in the required parameters in the [appsettings.json](./Embed%20for%20your%20customers/AppOwnsData/appsettings.json) file. Refer to [PowerBI.cs](./Embed%20for%20your%20customers/AppOwnsData/Models/PowerBI.cs) and [AzureAd.cs](./Embed%20for%20your%20customers/AppOwnsData/Models/AzureAd.cs) for more info on the config parameters.

3. Build and run the application.


## Embed for your organization

### Set up a Power BI app

1. Register an Azure AD app using the [Power BI embedding setup tool](https://app.powerbi.com/embedsetup). For more information see [Register an Azure AD application to use with Power BI](https://docs.microsoft.com/power-bi/developer/embedded/register-app).

2. Verify that your Azure AD app have the **Read all datasets** and **Read all reports** permissions.

3. Go to the AAD app in [Azure portal](https://aka.ms/AppRegistrations) that was created in the previous step and click on "Authentication".

4. Under "Redirect URIs", add https://localhost:5000/signin-oidc

### Run the application on localhost

1. Open the [UserOwnsData.sln](./Embed%20for%20your%20organization/UserOwnsData.sln) file in Visual Studio. If you are using Visual Studio Code, open [UserOwnsData](./Embed%20for%20your%20organization/UserOwnsData) folder.

2. Fill in the required parameters in the [appsettings.json](./Embed%20for%20your%20organization/UserOwnsData/appsettings.json) file related to AAD app.

3. Build and run the application.

#### Supported browsers:

1. Google Chrome

2. Microsoft Edge

3. Mozilla Firefox

## Important

For security reasons, in a real world application, passwords and secrets should not be stored in config files. Instead, consider securing your credentials with an application such as Key Vault.
