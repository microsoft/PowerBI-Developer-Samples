
# Power BI Embedded Sample in Flask framework



### Requirements

1. Python 3

2. IDE (Recommended is Visual Studio Code)

  

### Embed a Power BI report

1. Refer to the [documentation](https://aka.ms/RegisterPowerBIApp) and register a Power BI app [here](https://app.powerbi.com/apps).

2. Put required values in the [config.py](App%20Owns%20Data/powerbiembedding/config.py) file related to AAD app, Power BI report, workspace, dataset, and user account information.

3. Save and restart the application.

  

### Set up Python Flask on a Windows machine

1. Install Python 3 and set its path in an environment variable.

2. Run the following command in CMD/ PowerShell in the folder where `requirements.txt` file is present.<br>

   `pip3 install -r requirements.txt`

  

### Run the application on localhost

1. Open Visual Studio Code.

2. Open _Python/App Owns Data/powerbiembedding_ folder.

3. Open integrated terminal and type the below command to start the application.<br>

   `flask run`

4. Open __localhost:5000__ in browser or follow the direction in the output log.