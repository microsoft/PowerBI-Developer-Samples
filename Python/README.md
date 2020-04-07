
# Power BI Embedded Sample in Flask framework



### Requirements

1. [Python 3](https://www.python.org/downloads/)

2. IDE

  

### Embed a Power BI report

1. For Master user, register a Native app [here](https://aka.ms/embedsetup/AppOwnsData) and for Service Principal, register a Server-side web app by following [this](https://aka.ms/EmbedServicePrincipal). Refer to [documentation](https://aka.ms/RegisterPowerBIApp).

2. Put required values in the [config.py](App%20Owns%20Data/powerbiembedding/config.py) file related to AAD app, Power BI report, workspace, and user account information.

  

### Set up Python Flask on a Windows machine

1. [Install](https://docs.python.org/3/using/index.html) [Python 3](https://www.python.org/downloads/) and add its installation path to the *Path* environment variable.

2. Run the following command in CMD/PowerShell in the folder where [requirements.txt](App%20Owns%20Data/requirements.txt) file is present.<br>

   `pip3 install -r requirements.txt`

  

### Run the application on localhost

1. Open IDE.

2. Open _Python/App Owns Data/powerbiembedding_ folder.

3. Open terminal and type the below command to start the application.<br>

   `flask run`


4. Open __localhost:5000__ in browser or follow the direction in the output log.

5. **Note:** Whenever you update the config file you must restart the app.



### Important

For security reasons, in a real world application, password or secret should not be stored in config. Instead, consider securing credentials with an application such as Key Vault.
