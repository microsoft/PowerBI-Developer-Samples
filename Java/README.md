# Power BI Embedded sample in Spring MVC framework

## Requirements

1. [JDK (or JRE)](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)<br/>
Find the steps to add Java path to environment variable [here](https://docs.oracle.com/javase/7/docs/webnotes/install/windows/jdk-installation-windows.html#path)<br/>
    To check if you have working JDK execute `java -version` in terminal

2. [Eclipse IDE](https://www.eclipse.org/downloads/packages/) (Download **Eclipse for Enterprise Java Developers**)

3. [Apache Tomcat](https://tomcat.apache.org/download-90.cgi) (Download binary distributions)

## Set up a Power BI app

Follow the steps on [aka.ms/EmbedForCustomer](https://aka.ms/embedforcustomer)

## Steps to build and run

1. Open Eclipse and Click Window > Show View > Select __Servers__.

2. Setup Tomcat server
    1. Go to Servers tab, click __No servers are available. Click this link to create new server...__
    2. Select v9.0 Tomcat version from Apache
    3. Click __Next__
    4. Click browse, then select the folder which contains Tomcat
    5. Select JRE which is available through system variable
    6. Click __Finish__
    7. There should be a Tomcat server now in the Servers tab

1. To import project,
Click File > Open Project from File System > Click on Directory > Select [AppOwnsData](./Embed%20for%20your%20customers/AppOwnsData) folder > Finish

2. Let Maven finish automatically downloading the dependencies in background.

3. Add Tomcat server to the project
    1. Right click __AppOwnsData__ (project's name) from Project Explorer and then click __Properties__
    2. Select __Targeted Runtimes__
    3. Select __Apache Tomcat__ from the list
    4. Click on Apply and Close

4. Fill in the required parameters in the [Config.java](./Embed%20for%20your%20customers/AppOwnsData/src/main/java/com/embedsample/appownsdata/config/Config.java) file related to AAD app, Power BI report, workspace, and user account information.

5. Run the project
    1. Right click project's name from Project Explorer
    2. Select Run As > __Run on Server__
    3. Select the created server and click __Finish__
    4. http://localhost:8080/appownsdatasample should open in browser

#### Supported browsers:

1. Google Chrome

2. Microsoft Edge

3. Mozilla Firefox

## Important

For security reasons, in a real world application, passwords and secrets should not be stored in config files. Instead, consider securing your credentials with an application such as Key Vault.

## Troubleshoot

Windows shows "File path too long" during Eclipse IDE setup extraction.

> Skip the files during extraction whose paths are too long

Windows shows error popup while trying to run the *eclipse.exe* file.

> Check the size of the extracted Eclipse setup folder. It should be ~599 MB.

Eclipse shows "Building has encountered a problem" or "Maven is not configured properly" error after importing the project.

> 1. Delete folder named 2.6 from __%userprofile%\\.m2\repository\org\apache\maven\plugins\maven-resources-plugin\\__ directory
> 2. Right click project's name from Project Explorer > Maven > Update Project > Check Force Update of Snapshots/Releases > Click Ok

Eclipse shows "The server cannot be started because one or more of the ports are invalid. Open the server editor and correct the invalid ports." error while starting the Tomcat server.

> 1. Click on Servers tab on the event log area of the IDE
> 2. Double click on the server name which says "Tomcat v9.0 Server at localhost..."
> 3. Set the Tomcat admin port to any available port (for e.g. 8079)

"Run on Server" option is not visible for running the project.

> 1. Right click on the project > Properties > Project Facets
> 2. Select Dynamic Web Module, Java, and JavaScript options are selected.
> 3. Click on Apply and Close.
