# This sample script calls the Power BI API to programmatically take over a dataset.

# For documentation, please see:
# https://docs.microsoft.com/rest/api/power-bi/datasets/takeoveringroup

# Instructions:
# 1. Install PowerShell (https://msdn.microsoft.com/en-us/powershell/scripting/setup/installing-windows-powershell) 
#    and the Power BI PowerShell cmdlets (Install-Module MicrosoftPowerBIMgmt)
#    https://docs.microsoft.com/en-us/powershell/power-bi/overview?view=powerbi-ps
# 2. Run PowerShell as an administrator
# 3. Fill in the parameters below
# 4. Change PowerShell directory to where this script is saved
# 5. > ./takeOverDataset.ps1

# Parameters - fill these in before running the script!
# =====================================================

$groupId = " FILL ME IN "           # the ID of the group (workspace) that hosts the dataset.
$datasetId = " FILL ME IN "         # the ID of dataset to rebind

# End Parameters =======================================

# Login to the Power BI service with your Power BI credentials
Login-PowerBI

# Make the request to bind to a gateway
$uri = "groups/$groupId/datasets/$datasetId/Default.TakeOver"

# Try to bind to a new gateway
try { 
    Invoke-PowerBIRestMethod -Url $uri -Method Post

    # Show error if we had a non-terminating error which catch won't catch
    if (-Not $?)
    {
        $errmsg = Resolve-PowerBIError -Last
        $errmsg.Message
    }
} catch {

    $errmsg = Resolve-PowerBIError -Last
    $errmsg.Message
}