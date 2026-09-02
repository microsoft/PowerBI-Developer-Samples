# Power BI credentials encryption sample in .NET Core

## Requirements

1. [.NET 8](https://dotnet.microsoft.com/download/dotnet/8.0) SDK or higher.

2. IDE/code editor. We recommend using Visual Studio Code or Visual Studio 2022 (version 17.8 or later).


### Set up the applications

Follow the steps on [aka.ms/EmbedForCustomer](https://aka.ms/embedforcustomer)

Create a separate Microsoft Entra app registration for users who operate this sample:

1. Add a web redirect URI for `https://localhost:5001/signin-oidc`.
2. Define an app role with the value `PowerBI.DatasourceAdmin` and allow users or groups as members.
3. Assign only the users or groups that are allowed to manage Power BI datasource credentials to that role.
4. Create a client secret and configure the tenant ID, client ID, and secret in the `OperatorAzureAd` section. Prefer environment variables, user secrets, or a secret store instead of writing the secret to `appsettings.json`.

The operator app registration authenticates and authorizes incoming users. Keep it separate from the privileged Power BI identity configured in the `AzureAd` section.

### Run the application on localhost

1. Open the [EncryptCredentials.sln](./EncryptCredentials.sln) file in Visual Studio. If you are using Visual Studio Code, open [EncryptCredentials](./EncryptCredentials) folder.

2. Fill in the required parameters in the [appsettings.json](./EncryptCredentials/appsettings.json) file related to AAD app.

3. Build and run the application.

#### Supported browsers:

1. Google Chrome

2. Microsoft Edge

3. Mozilla Firefox

> **Note:** 
> 1. The Azure AD Service Principal which is used for authentication should have admin rights on the corresponding workspace.
> 2. If Service Principal mode is used for authentication and on-premises gateway is used, then SP should be the gateway admin.

## Important

For security reasons, in a real world application, passwords and secrets should not be stored in config files. Instead, consider securing your credentials with an application such as Key Vault.
