# log into Azure AD user account with hard-code user name and password
$userName = "YOUR_USER_NAME" # e.g. user1@devtenant.onMicrosoft.com
$password = "YOUR_PASSWORD"
                                                                                                                                                                                                            $password = "Pa`$`$word!"
# convert password to secure string
$securePassword = ConvertTo-SecureString -String $password -AsPlainText -Force

# create PSCredential object to serve as login credentials
$credential = New-Object -TypeName System.Management.Automation.PSCredential `
                         -ArgumentList $userName, $securePassword

# log into Power BI unattended without any user interaction

$user = Connect-PowerBIServiceAccount -Credential $credential

$userName = $user.UserName

Write-Host
Write-Host "Now logged in as $userName"

Get-PowerBIWorkspace | Format-Table Name, Id