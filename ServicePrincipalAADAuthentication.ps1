########################################################################
# Script created by Cesar Almeida
# 19/06/2023
#
# **Notes**
# Script created based on the code here:
# https://learn.microsoft.com/en-us/powershell/module/microsoftpowerbimgmt.profile/connect-powerbiserviceaccount?view=powerbi-ps
# https://learn.microsoft.com/en-us/powershell/module/microsoftpowerbimgmt.profile/get-powerbiaccesstoken?view=powerbi-ps
#
# Please check the required modules in the documentation
########################################################################

# Service Principal credentials
$Secret = ""
$AppID = "" 
$AppPassword = ConvertTo-SecureString $Secret -AsPlainText -Force
$Credential = New-Object PSCredential $AppID, $AppPassword
$TenantID = ""

# Sign in with Service Principal credentials
Connect-PowerBIServiceAccount -Tenant $TenantID -ServicePrincipal -Credential $Credential

# Get the token from the previous call
$headers = Get-PowerBIAccessToken

# Use the token as the "header" for the API call
Invoke-RestMethod -Headers $headers -Uri 'https://api.powerbi.com/v1.0/myorg/groups'