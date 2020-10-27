Write-Host

Connect-PowerBIServiceAccount | Out-Null

$workspaceName = "Test Workspace 1"

$workspace = New-PowerBIGroup -Name $workspaceName

$workspace | select *