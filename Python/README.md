# Power BI Embedded Sample in Flask framework


### Requirements

1. [Python 3](https://www.python.org/downloads/)

2. IDE/ Code Editor (Recommended is Visual Studio Code)


### Set up a Power BI app

1. For Master user, register a Native app [here](https://aka.ms/embedsetup/AppOwnsData) and for Service Principal, register a Server-side web app by following [this](https://aka.ms/EmbedServicePrincipal).

2. Select "Read all datasets" and "Read all reports" permissions during Power BI app setup. Refer to the[documentation](https://aka.ms/RegisterPowerBIApp) for registering a Power BI app. 

   Refer to the [documentation](https://aka.ms/PowerBIPermissions) for the complete list of Power BI permissions.


### Set up Python Flask on a Windows machine

1. [Install](https://docs.python.org/3/using/index.html) [Python 3](https://www.python.org/downloads/) and add its installation path to the *Path* environment variable.

2. Run the following command in CMD/PowerShell in the path where [requirements.txt](Embed%20for%20your%20customers/requirements.txt) file is located.<br>

   `pip3 install -r requirements.txt`


### Run the application on localhost

1. Open IDE.

2. Open [powerbiembedding](Embed%20for%20your%20customers/powerbiembedding) folder.

3. Fill in the required parameters in [config.py](Embed%20for%20your%20customers/powerbiembedding/config.py) file related to AAD app, Power BI report, workspace, and user account information.

4. Run the following command in CMD/PowerShell to start the application.<br>

   `flask run`


5. Open **http://localhost:5000** in browser or follow the direction in the output log.

**Note:** Whenever you update the config file you must restart the app.


### Important

For security reasons, in a real world application, password or secret should not be stored in config. Instead, consider securing credentials with an application such as Key Vault.
