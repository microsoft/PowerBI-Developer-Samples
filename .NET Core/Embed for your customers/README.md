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

1. Open the [AppOwnsData.sln](./AppOwnsData.sln) file in Visual Studio. If you are using Visual Studio Code then, open [AppOwnsData](./AppOwnsData) folder.

2. Fill in the required parameters in the [appsettings.json](./AppOwnsData/appsettings.json) file. Refer to [PowerBI.cs](./AppOwnsData/Models/PowerBI.cs) and [AzureAd.cs](./AppOwnsData/Models/AzureAd.cs) for more info on the config parameters.

3. Build and run the application.

#### Supported browsers:

1. Google Chrome

2. Microsoft Edge

3. Mozilla Firefox

## Important

For security reasons, in a real world application, passwords and secrets should not be stored in config files. Instead, consider securing your credentials with an application such as Key Vault.
