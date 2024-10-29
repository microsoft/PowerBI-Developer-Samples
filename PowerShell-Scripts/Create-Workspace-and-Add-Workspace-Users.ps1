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

# add user as workspace member
$userEmail = "user1@tenant1.onMicrosoft.com"

Add-PowerBIWorkspaceUser -Id $workspace.Id -UserEmailAddress $userEmail -AccessRight Contributor
