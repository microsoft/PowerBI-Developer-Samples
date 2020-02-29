# NodeJS API Examples for Power BI - App Owns Data & User Owns Data

This sample application provides examples for how to interact with Power BI APIs to generate embed tokens.

These tokens may be used on client side JavaScript applications to embed Power BI reports on a web page; see this repository for more informaiton: <https://github.com/microsoft/PowerBI-JavaScript>

Prerequisites:

- After registering an app in Azure AD, populate the nessesary config parameters in ```config.js``` and in your environment variables.
- Use one of the methods in **powerbi-api-calls-sample.js** to make the coresponding api call:
  - localhost:8080/api/get-report
  - localhost:8080/api/generate-embed-token

Notes:

- When interfacing with the US Government Community Cloud, MasterUser cant be used, only a service principle
- The variables in ```config.js``` should not be hardcoded in a production application; they should be stored as environemnt variables
- For additional Cloud Configuration URLs, see ```../App Owns Data/PowerBIEmbedded_AppOwnsData/CloudConfigs```

Helpful Links:

- Configure Service Principle: <https://docs.microsoft.com/en-us/power-bi/developer/embed-service-principal>
- Embed Setup:
  - <https://app.powerbi.com/embedsetup/appownsdata>
  - <https://app.powerbigov.us/embedsetup/appownsdata>
