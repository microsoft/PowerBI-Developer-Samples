# this script requires user to be Power BI Service administrator or global tenant admin
Write-Host

Connect-PowerBIServiceAccount | Out-Null

# adding -Scope Organization is what requires admin permissions
Get-PowerBIWorkspace -Scope Organization -Filter "state eq 'Active'" | Format-Table Name, Type, Id