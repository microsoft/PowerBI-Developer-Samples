########################################################################
# Script created by Sabre Ammar and Cesar Almeida
# 25/05/2023
#
# **Notes**
# Script created based on the code here:
# https://endjin.com/blog/2020/12/how-to-update-credentials-for-an-on-prem-power-bi-data-source-using-powershell
#
# You will need the "EncrypCredentials" script to run this one, you can download them for the same repository as this one
# We would recommend to save this script in a folder that is not synchronized online as it may cause some runtime issues
########################################################################

#region Initialize 

# EncryptGatewayCredentials script path
$EncryptCredentialsScriptPath = " "

# Service Principal credentials
$Secret = ""
$AppID = " " 
$AppPassword = ConvertTo-SecureString $Secret -AsPlainText -Force
$Credential = New-Object PSCredential $AppID, $AppPassword
$TenantID = " "

# Update datasource API details 
$GatewayId = " "
$DatasourceId = " "
$UpdateDatasourceUrl = "https://api.powerbi.com/v1.0/myorg/gateways/$GatewayId/datasources/$DatasourceId"
$GetGatewayUrl = "https://api.powerbi.com/v1.0/myorg/gateways/$GatewayId"

## Datasource credentials
# username = SQL user in case of basic credentials, or windows user in case of windows credentials
$username = " "

# password = SQL user password in case of basic credentials, or windows user password in case of windows credentials
$password = ' '

# Oauth token for the required principal with audience that matches the datasource type
#$oauth2Token = ""

# Storage account key in case of storage account or blob
#$AccountKey = ""

#endregion

# Sign in with Service Principal credentials
Connect-PowerBIServiceAccount -Tenant $TenantID -ServicePrincipal -Credential $Credential

# Get gateway public key
$GatewayObject = Invoke-PowerBIRestMethod -Url $GetGatewayUrl -Method Get | ConvertFrom-Json
$GatewayPublicKey = $GatewayObject.publicKey
$gatewayExponent = $GatewayPublicKey.exponent
$gatewayModulus = $GatewayPublicKey.modulus

# Encrypt basic credentials using EncryptGatewayCredentials script
Import-Module $EncryptCredentialsScriptPath

#$encryptedCredentials = EncryptBasicCredentials -Username $username -PasswordAsString $password -GatewayExponent $gatewayExponent -GatewayModulus $gatewayModulus
 $encryptedCredentials = EncryptWindowsCredentials -Username $username -PasswordAsString $password -GatewayExponent $gatewayExponent -GatewayModulus $gatewayModulus
# $encryptedCredentials = EncryptAnonymousCredentials -GatewayExponent $gatewayExponent -GatewayModulus $gatewayModulus
# $encryptedCredentials = EncryptOauthCredentials -OauthToken $oauth2Token -GatewayExponent $gatewayExponent -GatewayModulus $gatewayModulus
# $encryptedCredentials = EncryptKeyCredentials -Key $AccountKey -GatewayExponent $gatewayExponent -GatewayModulus $gatewayModulus

Invoke-PowerBIRestMethod -Url $UpdateDatasourceUrl -Method Patch -Body $encryptedCredentials
