########################################################################
# Script created by Jerry Tang
# 30/03/2033
#
# **Notes**
# Make sure you have the PowerBIMgmt module installed
# Install-Module -Name MicrosoftPowerBIMgmt
#
# REST API: Reports - Export Report In Group https://learn.microsoft.com/en-us/rest/api/power-bi/reports/export-report-in-group
# If the file is large so the export takes long time to complete, then we might reach the timeout (can happen not just in Try-It). 
# As a result the preferefClientRouting is required as a workaround to skip the timeout limitation (see https://learn.microsoft.com/en-us/power-bi/developer/embedded/troubleshoot-rest-api#fix-timeout-exceptions-when-using-import-and-export-apis), or use this PowerShell script.
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
