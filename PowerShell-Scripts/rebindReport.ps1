# This sample script calls the Power BI API to programmatically clone a SOURCE report to a 
# TARGET report in the Power BI service. The clone can either be based off of the same 
# dataset or a new dataset

# For documentation, please see:
# https://msdn.microsoft.com/en-us/library/mt784674.aspx

# Instructions:
# 1. Install PowerShell (https://msdn.microsoft.com/en-us/powershell/scripting/setup/installing-windows-powershell) 
#    and the Azure PowerShell cmdlets (Install-Module AzureRM)
# 2. Run PowerShell as an administrator
# 3. Follow the instructions below to fill in the client ID
# 4. Change PowerShell directory to where this script is saved
# 5. > ./rebindReport.ps1

# Parameters - fill these in before running the script!
# =====================================================

# SOURCE report info
# An easy way to get this is to navigate to the report in the Power BI service
# The URL will contain the group and report IDs with the following format:
# app.powerbi.com/groups/{groupID}/report/{reportID} 

$sourceReportGroupId = " FILL ME IN "    # the ID of the group (workspace) that hosts the source report. Use "me" if this is your My Workspace
$sourceReportId = " FILL ME IN "         # the ID of the source report

# TARGET report info
# An easy way to get group and dataset ID is to go to dataset settings and click on the dataset
# that you'd like to refresh. Once you do, the URL in the address bar will show the group ID and 
# dataset ID, in the format: 
# app.powerbi.com/groups/{groupID}/settings/datasets/{datasetID} 

$targetReportName = " FILL ME IN "       # what you'd like to name the target report
$targetGroupId = " FILL ME IN "          # the ID of the group (workspace) that you'd like to move the report to. Leave this blank if you'd like to clone to the same workspace. Use "me" if this is your My Workspace
$targetDatasetId = " FILL ME IN "        # the ID of the dataset that you'd like to rebind the target report to. Leave this blank to have the target report use the same dataset

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
if ($sourceReportGroupId -eq "me") {
    $sourceGroupsPath = "myorg"
} else {
    $sourceGroupsPath = "myorg/groups/$sourceReportGroupId"
}

# POST body 
$postParams = @{
    "Name" = "$targetReportName"
    "TargetWorkspaceId" = "$targetGroupId"
    "TargetModelId" = "$targetDatasetId"
}

$jsonPostBody = $postParams | ConvertTo-JSON

# Make the request to clone the report
$uri = "https://api.powerbi.com/v1.0/$sourceGroupsPath/reports/$sourceReportId/clone"
Invoke-RestMethod -Uri $uri –Headers $authHeader –Method POST -Body $jsonPostBody –Verbose