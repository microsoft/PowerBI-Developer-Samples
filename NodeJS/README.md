# Embed token generation in Node JS



### Requirements
   
1. [Node JS](https://nodejs.org/en/download/)

2. IDE

  

### Generate Embed token

1. For Master user, register a Native app [here](https://aka.ms/embedsetup/AppOwnsData). Refer to [documentation](https://aka.ms/RegisterPowerBIApp).

2. Put required values in the [config.json](Embed%20Token%20Generation/config.json) file related to AAD app, Power BI report, workspace, and user account information.

  

### Run the application to generate Embed token

1. Open IDE.

2. Open _NodeJS/Embed Token Generation_ folder.

3. Open terminal and install required dependencies by executing the following command.<br>
   `npm install`
   
4.  Execute the below command to start the application.<br>
   `node app-owns-data-sample.js`

5. See the output logs for generated Embed token.

### Important

For security reasons, in a real world application, password or secret should not be stored in config. Instead, consider securing credentials with an application such as Key Vault.