# Load test the import process for Power BI for V1 and V2

You will need
PBIX reports, locally on disk
- The path to the folder

For V1 A worksapce collection
- Collection name
- Collection key

For V2 A Power BI Pro User
 - username 
 - password

(optional) For V2, a capacity server name
A Power BI Azure Active Directy application with permissions to power bi
 - clientId

(optional) If you want to test setting the data source
A SQL Server with match schema
- connection string
- sql username
- sql password

(optional) Azure application insights logging
- the insights key

You can check the reports using log file and 
https://microsoft.github.io/PowerBI-JavaScript/demo/v2-demo/index.html