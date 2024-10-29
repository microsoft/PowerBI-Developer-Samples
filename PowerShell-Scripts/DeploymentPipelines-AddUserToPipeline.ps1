# This sample script calls the Power BI API to programmatically add a user as a pipeline admin.

# For documentation, please see:
# https://docs.microsoft.com/en-us/rest/api/power-bi/pipelines/update-pipeline-user

# Note: granting access to the pipeline doesn't give permissions to the assigned workspaces. 
# To grant workspace permissions, please see:
# https://docs.microsoft.com/en-us/rest/api/power-bi/groups/add-group-user

# Instructions:
# 1. Install PowerShell (https://msdn.microsoft.com/en-us/powershell/scripting/setup/installing-windows-powershell) 
#    and the Power BI PowerShell cmdlets (Install-Module MicrosoftPowerBIMgmt)
#    https://docs.microsoft.com/en-us/powershell/power-bi/overview?view=powerbi-ps
# 2. Run PowerShell as an administrator
# 3. Fill in the parameters below
# 4. Change PowerShell directory to where this script is saved
# 5. > DeploymentPipelines-AddUserToPipeline.ps1

# Parameters - fill these in before running the script!
# =====================================================

$pipelineName = " FILL ME IN "      # The name of an exisiting pipeline
$userUpn = " FILL ME IN "           # The UPN of the user to be added to the pipeline 

# End Parameters =======================================

# Login to the Power BI service
Connect-PowerBIServiceAccount | Out-Null

try {
    # Get the pipeline according to pipelineName
    $pipelines = Invoke-PowerBIRestMethod -Url "pipelines" -Method Get | ConvertFrom-Json     
    
    $pipeline = $pipelines.Value | Where-Object displayName -eq $pipelineName
    if(!$pipeline) {
        Write-Host "A pipeline with the requested name was not found"
        return
    }
    
    # Add user as admin to the pipeline
    $updateAccessUrl = "pipelines/{0}/users" -f $pipeline.Id

    $updateAccessBody = @{ 
        identifier = $userUpn
        accessRight = "Admin"
        principalType = "User"
    } | ConvertTo-Json

    Invoke-PowerBIRestMethod -Url $updateAccessUrl  -Method Post -Body $updateAccessBody
    
} catch {
    $errmsg = Resolve-PowerBIError -Last
    $errmsg.Message
}