# this script requires user to be Power BI Service administrator or global tenant admin
Write-Host

Connect-PowerBIServiceAccount | Out-Null

# update $workspaceName variable with name of target workspace
$workspaceName = "YOUR_WORKSPACE_NAME"

$workspace = Get-PowerBIWorkspace -Name $workspaceName -Scope Organization -Include All
$workspaceId = $workspace.Id

$outputFile = "$PSScriptRoot/WorkspaceReport.txt"
"Inventory Report for $workspaceName ($workspaceId)" | Out-File $outputFile

"`n- Users:" | Out-File $outputFile -Append
foreach($user in $workspace.Users){
  $userId = $user.Identifier
  $userAccessRight = $user.AccessRight
  "  - $userId ($userAccessRight)" | Out-File $outputFile -Append
}

"`n- Datasets:" | Out-File $outputFile -Append
foreach($dataset in $workspace.Datasets){
  $dataset | select *
  $datasetName = $dataset.Name
  $datasetId = $dataset.Id
  $ConfiguredBy = $dataset.ConfiguredBy
  $ContentProviderType = $dataset.ContentProviderType
  "   - $datasetName ($datasetId) - $ContentProviderType - Configured by $ConfiguredBy " | Out-File $outputFile -Append
}

"`n- Reports:" | Out-File $outputFile -Append
foreach($report in $workspace.Reports){
  $reportName = $report.Name
  $reportId = $report.Id
  $datasetId = $report.DatasetId
  "   - $reportName (ReportId:$reportId - DatasetId:$datasetId) " | Out-File $outputFile -Append
}

notepad.exe $outputFile