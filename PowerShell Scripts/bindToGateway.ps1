# This sample script calls the Power BI API to programmatically rebind a dataset to
# another gateway.

# For documentation, please see:
# https://msdn.microsoft.com/en-us/library/mt784650.aspx

# Instructions:
# 1. Install PowerShell (https://msdn.microsoft.com/en-us/powershell/scripting/setup/installing-windows-powershell) 
#    and the Azure PowerShell cmdlets (Install-Module AzureRM)
# 2. Run PowerShell as an administrator
# 3. Fill in the parameters below
# 4. Change PowerShell directory to where this script is saved
# 5. > ./bindToGateway.ps1

# Parameters - fill these in before running the script!
# =====================================================

$groupId = " FILL ME IN "           # the ID of the group (workspace) that hosts the dataset.
$newGatewayId = " FILL ME IN "      # the ID of the new gateway
$datasetId = " FILL ME IN "         # the ID of dataset to rebind

# AAD Client ID
# To get this, go to the following page and follow the steps to provision an app
# https://dev.powerbi.com/apps
# To get the sample to work, ensure that you have the following fields:
# App Type: Native app
# Redirect URL: urn:ietf:wg:oauth:2.0:oob
#  Level of access: all dataset APIs
$clientId = " FILL ME IN " 

# End Parameters =======================================

# Calls the Active Directory Authentication Library (ADAL) to authenticate against AAD
# Install-Module AzureAD
function GetAuthToken
{

    $redirectUri = "urn:ietf:wg:oauth:2.0:oob"

    $resourceAppIdURI = "https://analysis.windows.net/powerbi/api"

    $authority = "https://login.microsoftonline.com/common/oauth2/authorize";

    $authContext = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext" -ArgumentList $authority

    $authResult = $authContext.AcquireToken($resourceAppIdURI, $clientId, $redirectUri, "Auto")

    return $authResult
}

# Get the auth token from AAD
$token = GetAuthToken

# Building Rest API header with authorization token
$authHeader = @{
    'Content-Type'='application/json'
    'Authorization'=$token.CreateAuthorizationHeader()
 }

 # properly format groups path
$sourceGroupsPath = ""
if ($groupId -eq "me") {
    $sourceGroupsPath = "myorg"
} else {
    $sourceGroupsPath = "myorg/groups/$groupId"
}

# POST body 
$postParams = @{
    "gatewayObjectId" = "$newGatewayId"
}

$jsonPostBody = $postParams | ConvertTo-JSON

# Make the request to bind to a gateway
$uri = "https://api.powerbi.com/v1.0/$sourceGroupsPath/datasets/$datasetId/BindToGateway"

# Try to bind to a new gateway
try {
    Invoke-RestMethod -Uri $uri -Headers $authHeader -Method POST -Body $jsonPostBody -Verbose 
} catch {

    $result = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($result)
    $reader.BaseStream.Position = 0
    $reader.DiscardBufferedData()
    $responseBody = $reader.ReadToEnd();

    # DMTS_CanNotFindMatchingDatasourceInGatewayError means that there is no datasource available in a gateway to bind to.
    # we can ignore DMTS_CanNotFindMatchingDatasourceInGatewayError
    If(($responseBody).Contains("DMTS_CanNotFindMatchingDatasourceInGatewayError"))
    {
        Write-Host "Error: No data source available in gateway."
    }
    elseif($_.Exception.Response.StatusCode.value__ -eq "401")
    {
        Write-Host "Error: No access to app workspace."
    }
    elseif($_.Exception.Response.StatusCode.value__ -eq "404")
    {
        Write-Host "Error: Dataset may be owned by someone else. Call take over API to assume ownership and try again. For more information, see https://msdn.microsoft.com/en-us/library/mt784651.aspx."
    }
    else
    {
        Write-Host "StatusCode:" $_.Exception.Response.StatusCode.value__ 
        Write-Host "StatusDescription:" $_.Exception.Response.StatusDescription
        Write-Host "StatusBody:" $responseBody
    }
}