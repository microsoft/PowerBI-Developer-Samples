# This sample script calls the Power BI API to programmatically deploy all content between stages in your pipeline.

# For documentation, please see:
# https://docs.microsoft.com/rest/api/power-bi/pipelines/deployall

# Instructions:
# 1. Install PowerShell (https://msdn.microsoft.com/en-us/powershell/scripting/setup/installing-windows-powershell) 
#    and the Power BI PowerShell cmdlets (Install-Module MicrosoftPowerBIMgmt)
#    https://docs.microsoft.com/en-us/powershell/power-bi/overview?view=powerbi-ps
# 2. Run PowerShell as an administrator
# 3. Fill in the parameters below
# 4. Change PowerShell directory to where this script is saved
# 5. > ./DeploymentPipelines-DeployAll.ps1
# 6. [Optional] Wait for deploy to be completed - see DeploymentPipelines-WaitForDeployment.ps1

# Parameters - fill these in before running the script!
# =====================================================

$pipelineName = " FILL ME IN "      # The name of the pipeline
$stageOrder = 0                     # The order of the source stage. Development (0), Test (1).

# End Parameters =======================================

# Login to the Power BI service
Connect-PowerBIServiceAccount | Out-Null

try { 
    #Get pipelines
    $pipelines = (Invoke-PowerBIRestMethod -Url "pipelines"  -Method Get | ConvertFrom-Json).value

    #Try to find the pipeline by display name
    $pipeline = $pipelines | Where-Object {$_.DisplayName -eq $pipelineName}

    if(!$pipeline) {            
        Write-Host "Pipeline with requested name was not found"
        return
    }    

    #construct the request url and body
    $url = "pipelines/{0}/DeployAll" -f $pipeline.Id

    $body = @{ 
        sourceStageOrder = $stageOrder

        options = @{
            # Allows creating new artifact if needed on the Test stage workspace
            allowCreateArtifact = $TRUE

            # Allows overwriting existing artifact if needed on the Test stage workspace
            allowOverwriteArtifact = $TRUE
        }
    } | ConvertTo-Json

    $deployResult = Invoke-PowerBIRestMethod -Url $url  -Method Post -Body $body | ConvertFrom-Json

    "Operation id: {0}" -f $deployResult.id
} catch {
    $errmsg = Resolve-PowerBIError -Last
    $errmsg.Message
}