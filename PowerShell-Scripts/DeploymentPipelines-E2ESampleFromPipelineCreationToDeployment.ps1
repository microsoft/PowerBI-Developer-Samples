# This sample script calls the Power BI API to programmatically create a pipeline, assign a workspace to Production stage, backward deploy to Test and Development.

# For documentation, please see:
# https://docs.microsoft.com/en-us/rest/api/power-bi/pipelines/create-pipeline
# https://docs.microsoft.com/en-us/rest/api/power-bi/pipelines/assign-workspace
# https://docs.microsoft.com/en-us/rest/api/power-bi/pipelines/deploy-all

# Instructions:
# 1. Install PowerShell (https://msdn.microsoft.com/en-us/powershell/scripting/setup/installing-windows-powershell) 
#    and the Power BI PowerShell cmdlets (Install-Module MicrosoftPowerBIMgmt)
#    https://docs.microsoft.com/en-us/powershell/power-bi/overview?view=powerbi-ps
# 2. Run PowerShell as an administrator
# 3. Fill in the parameters below
# 4. Change PowerShell directory to where this script is saved
# 5. > DeploymentPipelines-E2ESampleFromPipelineCreationToDeployment.ps1

# Parameters - fill these in before running the script!
# =====================================================

$pipelineDisplayName = " FILL ME IN "       # The display name of the new pipeline
$pipelineDescritionName = " FILL ME IN "    # The description of the new pipeline
$workspaceName = " FILL ME IN "             # The name of an exisiting workspace which will be assigned to the Production stage in the new pipeline

# End Parameters =======================================

# Login to the Power BI service
Connect-PowerBIServiceAccount | Out-Null

try {
    # Get the workspace according to workspaceName
    $workspace = Get-PowerBIWorkspace -Filter "name eq '$workspaceName'"

    if(!$workspace) {
        Write-Host "A workspace with the requested name was not found"
        return
    }
    
    # Create a new deployment pipeline
    $createPipelineBody = @{ 
            displayName = $pipelineDisplayName
            description = $pipelineDescritionName
        } | ConvertTo-Json

    $newPipeline = Invoke-PowerBIRestMethod -Url "pipelines"  -Method Post -Body $createPipelineBody | ConvertFrom-Json

    # Assign workspace to the pipeline in the Production stage
    $stageOrder = 2     # The deployment pipeline stage order. Development (0), Test (1), Production (2).
    $assignUrl = "pipelines/{0}/stages/{1}/assignWorkspace" -f $newPipeline.Id, $stageOrder
    
    $assignWorkspaceBody = @{ 
            workspaceId = $workspace.Id
        } | ConvertTo-Json
        
    Invoke-PowerBIRestMethod -Url $assignUrl -Method Post -Body $assignWorkspaceBody
    
    # Backward deploy from Production to Test
    $deployUrl = "pipelines/{0}/DeployAll" -f $newPipeline.Id

    $deployToTestBody = @{ 
        sourceStageOrder = 2
        isBackwardDeployment = $TRUE
        newWorkspace = @{
            name = "{0} [Test]" -f $workspaceName
        }
        
        options = @{
            allowCreateArtifact = $TRUE
            allowOverwriteArtifact = $TRUE
        }
    } | ConvertTo-Json

    $deployResult = Invoke-PowerBIRestMethod -Url $deployUrl  -Method Post -Body $deployToTestBody | ConvertFrom-Json
    
    # Wait for deployment operation from Production to Test to complete
    $operationStatus = $deployResult.Status
    $getOperationUrl =  "pipelines/{0}/Operations/{1}" -f $newPipeline.Id, $deployResult.Id

    while($operationStatus -eq "NotStarted" -or $operationStatus -eq "Executing")
    {
        # Sleep for 5 seconds
        Start-Sleep -s 5

        # Get the deployment operation details
        $operation = Invoke-PowerBIRestMethod -Url $getOperationUrl -Method Get | ConvertFrom-Json
        $operationStatus = $operation.Status
    }
    
    # Backward deploy from Test to Development
    $deployToDevBody = @{ 
        sourceStageOrder = 1
        isBackwardDeployment = $TRUE
        newWorkspace = @{
            name = "{0} [Development]" -f $workspaceName
        }
        
        options = @{
            allowCreateArtifact = $TRUE
            allowOverwriteArtifact = $TRUE
        }
    } | ConvertTo-Json

    $deployResult = Invoke-PowerBIRestMethod -Url $deployUrl  -Method Post -Body $deployToDevBody | ConvertFrom-Json

} catch {
    $errmsg = Resolve-PowerBIError -Last
    $errmsg.Message
}