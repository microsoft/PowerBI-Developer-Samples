# Power BI Embedded sample in .NET Framework

## Requirements

1. [.NET Framework 4.8](https://aka.ms/dotnet48)

2. IDE/code editor. We recommend using Visual Studio 2019.

# Embed for your customers

## Set up a Power BI app

Follow the steps on [aka.ms/EmbedForCustomer](https://aka.ms/embedforcustomer)

## Run the application on localhost

1. Open the [AppOwnsData.sln](Embed%20for%20your%20customers/AppOwnsData.sln) file in Visual Studio.

2. Fill in the required parameters in the [Web.config](Embed%20for%20your%20customers/AppOwnsData/Web.config) file.

3. Restore NuGet packages (right click on [AppOwnsData.sln](Embed%20for%20your%20customers/AppOwnsData.sln) file in Visual Studio solution explorer window and click **Restore NuGet packages**).

4. Restore client side libraries (right click on [AppOwnsData.sln](Embed%20for%20your%20customers/AppOwnsData.sln) file in Visual Studio solution explorer window and click **Restore Client-Side Libraries**).

5. Build the application.

6. Run the application.

# Embed for your organization

## Set up a Power BI app

1. Register an Azure AD app following the instructions [here](https://go.microsoft.com/fwlink/?linkid=2134543#register-your-app).

2. Verify that your Azure AD app have the **Read all dashboards**, **Read all reports**, and **Read all workspaces** permissions.

3. Go to the AAD app in [Azure portal](https://aka.ms/AppRegistrations) that was created in the previous step and click on "Authentication".

4. Under "Redirect URIs", add https://localhost:44300/

## Run the application on localhost

1. Open the [UserOwnsData.sln](Embed%20for%20your%20organization\UserOwnsData.sln) file in Visual Studio.

2. Fill in the required parameters in the [Web.config](Embed%20for%20your%20organization\UserOwnsData\Web.config) file related to AAD app.

3. Restore NuGet packages (right click on [UserOwnsData.sln](Embed%20for%20your%20organization\UserOwnsData.sln) file in Visual Studio solution explorer window and click **Restore NuGet packages**).

4. Restore client side libraries (right click on [UserOwnsData.sln](Embed%20for%20your%20organization\UserOwnsData.sln) file in Visual Studio solution explorer window and click **Restore Client-Side Libraries**).

5. Build the application.

6. Run the application.

#### Supported browsers:

1. Google Chrome

2. Microsoft Edge

3. Mozilla Firefox

## Important

For security reasons, in a real world application, passwords and secrets should not be stored in config files. Instead, consider securing your credentials with an application such as Key Vault.
