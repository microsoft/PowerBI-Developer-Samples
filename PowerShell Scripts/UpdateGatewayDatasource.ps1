########################################################################
# Script created by Sabre Ammar and Cesar Almeida
# 09/03/2023
# 
# **Notes**
# Script created based on the code here:
# https://endjin.com/blog/2020/12/how-to-update-credentials-for-an-on-prem-power-bi-data-source-using-powershell
#
# API used here:
# https://learn.microsoft.com/en-us/rest/api/power-bi/gateways/update-datasource
#
# This script will only be usefull when you need to update the credentials only, as when the password from your datasource
# has been changed. If you need to change the datasource, you need to use the following script:
# https://github.com/microsoft/PowerBI-Developer-Samples/blob/master/PowerShell%20Scripts/Update-Connection-Details-for-Sql-Datasource.ps1
########################################################################

# Variables
$TenantID = ""
$Secret = ""
$AppID = ""
$Password = ConvertTo-SecureString $Secret -AsPlainText -Force
$Credential = New-Object PSCredential $AppID, $Password
$GwId = ""
$datasourceId = ""
$datasetId = ""
$upUrl = "https://api.powerbi.com/v1.0/myorg/gateways/$GwId/datasources/$datasourceId"
$spoToken = ""

# Install the Power BI package into the current working directory if it's not already installed
if (!(Test-Path ".\Microsoft.PowerBI.Api.3.18.1" -PathType Container)) {
    Install-Package -Name Microsoft.PowerBi.Api -ProviderName NuGet -Scope CurrentUser -RequiredVersion 3.18.1 -SkipDependencies -Destination . -Force
}

# Install the Client Runtime package, a dependency of the Power BI package
if (!(Test-Path ".\Microsoft.Rest.ClientRuntime.2.3.22" -PathType Container)) {
    Install-Package -Name Microsoft.Rest.ClientRuntime -ProviderName NuGet -Scope CurrentUser -RequiredVersion 2.3.22 -SkipDependencies -Destination . -Force
}

# Install the Newtonsoft package, another dependency of the Power BI package
if (!(Test-Path ".\Newtonsoft.Json.11.0.2" -PathType Container)) {
    Install-Package -Name Newtonsoft.Json -ProviderName NuGet -Scope CurrentUser -RequiredVersion 11.0.2 -SkipDependencies -Destination . -Force
}

# Load the Client Runtime assembly into the session
$crpath = Resolve-Path ".\Microsoft.Rest.ClientRuntime.2.3.22\lib\netstandard2.0\Microsoft.Rest.ClientRuntime.dll"
[System.Reflection.Assembly]::LoadFrom($crpath)

# Load the Newtonsoft assembly into the session
$nwpath = Resolve-Path ".\Newtonsoft.Json.11.0.2\lib\netstandard2.0\Newtonsoft.Json.dll"
[System.Reflection.Assembly]::LoadFrom($nwpath)

# Conditionally choose the Power BI assembly to use, depending on whether you're using Windows PowerShell (version <= 5) or PowerShell Core (version >= 6)
if ($PSVersionTable.PSVersion.Major -le 5) {
    $pbipath = Resolve-Path ".\Microsoft.PowerBI.Api.3.18.1\lib\net48\Microsoft.PowerBI.Api.dll"
}
else {
    $pbipath = Resolve-Path ".\Microsoft.PowerBI.Api.3.18.1\lib\netstandard2.0\Microsoft.PowerBI.Api.dll"
}

# Load the Power BI assembly into the session
[System.Reflection.Assembly]::LoadFrom($pbipath)

# Input the credentials (this is using Basic credentials, but the same principle applies to the other types). Any sensitive info should be handled securely (using Azure KeyVault or Azure DevOps secret variables, for example) but for demonstration purposes, I've included a $password variable here so you can see how things work.
$username = ""
$password = ""

# Connect to PBI using SPN
Connect-PowerBIServiceAccount -Tenant $TenantID -ServicePrincipal -Credential $Credential

# Retrieve the Gateway information
$gw = Invoke-PowerBIRestMethod -Url "https://api.powerbi.com/v1.0/myorg/gateways/$GwId" -Method GET | ConvertFrom-Json

# Create the objects to perform the necessary encryption on the credentials. Again, since I'm using basic credentials, I'm constructing a new BasicCredentials class. Other classes can be found here: https://github.com/microsoft/PowerBI-CSharp/tree/bf7cdf047a0218f7a8555fa7966445812a043955/sdk/PowerBI.Api/Extensions/Models/Credentials
$gatewayKeyObj = [Microsoft.PowerBI.Api.Models.GatewayPublicKey]::new($gw.publicKey.exponent, $gw.publicKey.modulus)
#$basicCreds = [Microsoft.PowerBI.Api.Models.Credentials.BasicCredentials]::new($username, $password)
$windowsCread = [Microsoft.PowerBI.Api.Models.Credentials.WindowsCredentials]::new($accessToken)
#$oauth2Cread = [Microsoft.PowerBI.Api.Models.Credentials.OAuth2Credentials]::new($accessToken)
$credentialsEncryptor = [Microsoft.PowerBI.Api.Extensions.AsymmetricKeyEncryptor]::new($gatewayKeyObj)

# Construct the CredentialDetails object. The resulting "Credentials" property on this object will have been encrypted appropriately, ready for use in the request payload.
$credentialDetails = [Microsoft.PowerBI.Api.Models.CredentialDetails]::new(
    $windowsCred, 
    [Microsoft.PowerBI.Api.Models.PrivacyLevel]::Organizational, 
    [Microsoft.PowerBI.Api.Models.EncryptedConnection]::Encrypted, 
    $credentialsEncryptor)

# Construct the body for the request.
$body = @{
    credentialDetails = @{
    credentialType      = $credentialDetails.credentialType;
    credentials         = $credentialDetails.credentials;
    encryptedConnection = $credentialDetails.encryptedConnection;
    encryptionAlgorithm = $credentialDetails.encryptionAlgorithm;
    privacyLevel        = $credentialDetails.privacyLevel;
  }
}

Invoke-PowerBIRestMethod -Url $upUrl -Method PATCH -Body ($body | ConvertTo-Json)
