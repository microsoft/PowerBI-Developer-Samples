########################################################################
# Script created by Jerry Tang
# 30/03/2023
#
# Instructions:
# 1. Install PowerShell (https://msdn.microsoft.com/en-us/powershell/scripting/setup/installing-windows-powershell) 
#    and the Power BI PowerShell cmdlets (Install-Module MicrosoftPowerBIMgmt)
#    https://docs.microsoft.com/en-us/powershell/power-bi/overview?view=powerbi-ps
# 2. Run PowerShell as an administrator
# 3. Fill in the parameters below
# 4. Change PowerShell directory to where this script is saved
#
# REST API: Reports - Export Report In Group https://learn.microsoft.com/en-us/rest/api/power-bi/reports/export-report-in-group
# If the file is large so the export takes long time to complete, then we might reach the timeout (can happen not just in Try-It). 
# As a result the preferefClientRouting is required as a workaround to skip the timeout limitation (see https://learn.microsoft.com/en-us/power-bi/developer/embedded/troubleshoot-rest-api#fix-timeout-exceptions-when-using-import-and-export-apis), or use this PowerShell script.
########################################################################

# Connect to Power BI
Connect-PowerBIServiceAccount

$workspaceName = "<WorkspaceName>"
$workspace = Get-PowerBIWorkspace -Name $workspaceName
$reportId = "<ReportId>"

if($workspace) {
  Write-Host "The workspace named $workspaceName already exists."
  
  #https://learn.microsoft.com/en-us/powershell/module/microsoftpowerbimgmt.reports/export-powerbireport?view=powerbi-ps
  Export-PowerBIReport -Id $reportId -WorkspaceId $workspace.Id -OutFile .\ExportReportByPowershell.pbix -Verbose
}
else {
  Write-Host "The workspace named $workspaceName does not exist."
  return
}
