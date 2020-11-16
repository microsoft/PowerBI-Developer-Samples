Write-Host

Connect-PowerBIServiceAccount | Out-Null

# update these parameters for target workspace and dataset 
$workspaceName = "YOUR_WORKSPACE_NAME"
$datasetName = "YOUR_DATASET_NAME"

$workspace = Get-PowerBIWorkspace -Name $workspaceName

$dataset = Get-PowerBIDataset -WorkspaceId $workspace.Id | Where-Object Name -eq $datasetName

$workspaceId = $workspace.Id
$datasetId = $dataset.Id

# create REST URL to update State parameter for newly-imported dataset
$datasetParametersUrl = "groups/$workspaceId/datasets/$datasetId/Default.UpdateParameters"

# parse together JSON for POST body to update dataset parameters
$parameterName = "myParameterName"
$newParameterValue = "New Parameter Value"
$postBody = "{updateDetails:[{name:'$parameterName', newValue:'$newParameterValue'}]}"

# invoke POST operation to update dataset parameters
Invoke-PowerBIRestMethod -Url:$datasetParametersUrl -Method:Post -Body:$postBody `
                         -ContentType:'application/json'

# if parameter updates change connection information (e.g. server path, database name), you will
# then be required to patch datasource credentials before you can refresh the dataset 