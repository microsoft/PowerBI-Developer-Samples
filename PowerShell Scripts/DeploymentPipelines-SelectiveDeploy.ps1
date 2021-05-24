# This sample script calls the Power BI API to programmatically deploy specific content between stages in your pipeline.

# For documentation, please see:
# https://docs.microsoft.com/rest/api/power-bi/pipelines/selectivedeploy

# Instructions:
# 1. Install PowerShell (https://msdn.microsoft.com/en-us/powershell/scripting/setup/installing-windows-powershell) 
#    and the Power BI PowerShell cmdlets (Install-Module MicrosoftPowerBIMgmt)
#    https://docs.microsoft.com/en-us/powershell/power-bi/overview?view=powerbi-ps
# 2. Run PowerShell as an administrator
# 3. Fill in the parameters below
# 4. Change PowerShell directory to where this script is saved
# 5. > ./DeploymentPipelines-SelectiveDeploy.ps1
# 6. [Optional] Wait for deploy to be completed - see DeploymentPipelines-WaitForDeployment.ps1

# Parameters - fill these in before running the script!
# =====================================================

$pipelineName = " FILL ME IN "      # The name of the pipeline
$stageOrder = 0                     # The order of the source stage. Development (0), Test (1).

$datasetName = " FILL ME IN "       # The name of the dataset to be deployed
$reportName = " FILL ME IN "        # The name of the report to be deployed
$dashboardName = " FILL ME IN "     # The name of the dashboard to be deployed

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

    #Get pipeline stage artifacts
    $artifactsUrl = "pipelines/{0}/stages/{1}/artifacts" -f $pipeline.Id,$stageOrder
    $artifacts = Invoke-PowerBIRestMethod -Url $artifactsUrl  -Method Get | ConvertFrom-Json

    $dataset = $artifacts.datasets | Where-Object {$_.artifactDisplayName -eq $datasetName}
    $report = $artifacts.reports | Where-Object {$_.artifactDisplayName -eq $reportName}
    $dashboard = $artifacts.dashboards | Where-Object {$_.artifactDisplayName -eq $dashboardName}

    if(!$dataset -or !$report -or !$dashboard){
        Write-Host "One or more of the requested artifacts was not found"
        return
    }

    if($dataset.Length -gt 1 -or $report.Length -gt 1 -or $dashboard.Length -gt 1){
        Write-Host "One or more of the requested artifact names match multiple instances"
        return
    }

    #construct the request url and body
    $url = "pipelines/{0}/Deploy" -f $pipeline.Id

    $body = @{ 
        sourceStageOrder = $stageOrder
            
        datasets = @(
            @{sourceId = $dataset.artifactId }
        )      

        reports = @(
            @{sourceId = $report.artifactId }
        )        
            
        dashboards = @(
            @{sourceId = $dashboard.artifactId }
        )


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