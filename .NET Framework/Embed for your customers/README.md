# Embed for your customers

Read this documentation to prepare your environment
https://docs.microsoft.com/en-us/power-bi/developer/embedding-content

## Choose Auth Method

In web.config:

- For authentication with master user credential choose MasterUser as AuthenticationType.

- For authentication with app secret choose ServicePrincipal as AuthenticationType (Preview).

More details here: https://docs.microsoft.com/en-us/power-bi/developer/embed-service-principal

To embed reports, dashboards and tiles, the following details must be specified within web.config:

| Detail            | Description                                                                                           |
|-------------------|-------------------------------------------------------------------------------------------------------|
| applicationId     | Id of the AAD application registered as a NATIVE app.                                                 |
| workspaceId       | The group or workspace Id in Power BI containing the reports, dashboards and tiles you want to embed. |
| pbiUsername       | A Power BI username (e.g. Email). The user must be an admin of the group above. (For Master User Only)|
| pbiPassword       | The password of the Power BI user above. (For Master User Only)                                       |
| applicationSecret | Seecret Key of the AAD application registered as a NATIVE app. (For Service Principal Only)           |
| tenant            | Tenant Id of the Apllication   . (For Service Principal Only)                                         |


## Important

For security reasons, in a real application, the user and password and app secret should not be saved in web.config. Instead, consider securing credentials with an application such as KeyVault.
