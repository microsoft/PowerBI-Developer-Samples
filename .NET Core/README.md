# Power BI Embedded Sample in .NET Core

## User Owns Data

1. To embed reports, dashboards and tiles, the following details must be specified within [appsettings.json](User\ Owns\ Data/NetCore-Sample/appsettings.json):

    | Detail        | Description                                                                                           |
    |---------------|-------------------------------------------------------------------------------------------------------|
    | applicationId | Id of the AAD application registered as a NATIVE app.                                                 |
    | groupId   | The group or workspace Id in Power BI containing the reports, dashboards and tiles you want to embed. |

2. Build and run the application