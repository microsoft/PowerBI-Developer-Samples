# Power BI Embedded sample in Spring MVC framework

## Requirements
* [JRE (or JDK)](https://www.oracle.com/technetwork/java/javase/downloads/index.html)<br/>
    To check if you have working JRE: Open cmd prompt/terminal, and run: ```java -version```<br/>
* [Eclipse](https://www.eclipse.org/downloads/)
* [Apache Tomcat](https://tomcat.apache.org/download-90.cgi)
	
## Embed a Power BI report
1. Refer to the [documentation](https://aka.ms/RegisterPowerBIApp) and register a Power BI app [here](https://app.powerbi.com/apps).
1. Put required values in the __config/Config.java__ file related to AAD app, Power BI report, workspace, dataset, and user account information.
1. Save and run the application.

## Steps to build and run:

1. Open Eclipse

1. To import project,
Select File > Open Projects from File System...
    
1. Add tomcat server to the project
    1. Right click Project's name from Project Explorer > Click Properties.
    1. Select __Targeted Runtimes__
    1. If there are no runtimes in the list, 
        1. Click New
        1. Select a Tomcat version from Apache directory
        1. Click Next
        1. Select JRE (leave as default if already available)
        1. Click Finish
    1. Select __Apache Tomcat__ (or any other runtime) from the list.
    1. Click Apply and Close

1. Run the project
    1. Right click Project's name from Project Explorer
    1. Select Run As > Run on Server
    1. Select the created server and click Finish
    1. Report embedding page (http://\<BASE_URL\>/appownsdatasample) should load.