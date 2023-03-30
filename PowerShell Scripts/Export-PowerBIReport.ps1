########################################################################
# Script created by Jerry Tang
# 30/03/2033
#
# **Notes**
# Make sure you have the PowerBIMgmt module installed
# Install-Module -Name MicrosoftPowerBIMgmt
#
# REST API: Reports - Export Report In Group https://learn.microsoft.com/en-us/rest/api/power-bi/reports/export-report-in-group
# If the file is large so the export takes long time to complete, and as a result we reach the timeout (can happened not just in try-it). 
# As a result the preferefClientRouting is required as a workaround to skip the timeout limitation.
#"Try it" button on REST API page is only for quick test to help you understand how to use this specific REST API. For real usage in Production environment, we shouldn't use the Try-it feature, and instead use a real development project (for example C# SDK or Powershell script).
#"Try it" is not a good way to test Export Report for large file. We could use this Powershell script. 
########################################################################

# Connect to Power BI
Connect-PowerBIServiceAccount

$workspaceName = "<WorkspaceName>"
$workspace = Get-PowerBIWorkspace -Name $workspaceName
if($workspace) {
  Write-Host "The workspace named $workspaceName already exists"
}
else {
  Write-Host "The workspace named $workspaceName does not exist"
}

#https://learn.microsoft.com/en-us/powershell/module/microsoftpowerbimgmt.reports/export-powerbireport?view=powerbi-ps
Export-PowerBIReport -Id '<ReportID>' -WorkspaceId $workspace.Id -OutFile .\ExportReportByPowershell.pbix -Verbose
