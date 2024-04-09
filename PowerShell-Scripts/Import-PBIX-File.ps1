Write-Host

Connect-PowerBIServiceAccount | Out-Null

$workspaceName = "Test Workspace 1"

$workspace = Get-PowerBIWorkspace -Name $workspaceName

if($workspace) {
  Write-Host "The workspace named $workspaceName already exists"
}
else {
  Write-Host "Creating new workspace named $workspaceName"
  $workspace = New-PowerBIGroup -Name $workspaceName
}

# update script with file path to PBIX file
$pbixFilePath = "$PSScriptRoot\MyReport.pbix"

$import = New-PowerBIReport -Path $pbixFilePath -Workspace $workspace -ConflictAction CreateOrOverwrite

$import | select *