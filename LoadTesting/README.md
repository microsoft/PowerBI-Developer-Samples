# Load test the import process for Power BI for V1 and V2

### What it does
- This tool will import Power BI Reports (PBIX) from a local folder into a capacity using the .net API
- It can import into a group if required
- It also supports connecting the database and setting sql username and password if provided
- It writes a html file out to provide the report is working (the token will expire after x time)
- It can also log of app insights to help compare the performance of loading

### Setup
1. Get some PBIX files on disk e.g. C:\pbix
1. Extract the tool (it is a .net 4.7 console app)
1. Get the name of capacity you want to load
1. Provide a group name (you can only have 1,000 reports per group)
1. Get the client id, user and password for idm config
1. If you want to test set connections, provide the server, database and ADMIN username and password (not rom request credentials)
1. If you want to use app insights, set the key here (from the portal)

### To run
- Double click or run from a command / powershell
- It is also possible to run the exe in a forloop
- To get the capacity to max memory, keep run the tool. 

### To review
- You can open the html templates that are in the out folder once complete
- You can review the logs if log4net is configured
- You can use Fiddler (the best tool ever) to monitor traffic
- You can monitor the traffic using app insights

### To do 
- Add build support (Travis?)
- Allow multiple exes to run at the same time (currently lo4net issues)
- Add delete support so the for loop could run forever
