# log into Power BI interactively as script begins to run
$user = Connect-PowerBIServiceAccount

$userName = $user.UserName

Write-Host
Write-Host "Now logged in as $userName"

Get-PowerBIWorkspace | Format-Table Name, Id