########################################################################
# Script created by Sabre Ammar, Cesar Almeida and Arjun Mohan
# 09/03/2023
#
# **Notes**
# Script created based on the code here:
# https://endjin.com/blog/2020/12/how-to-update-credentials-for-an-on-prem-power-bi-data-source-using-powershell
#
# You will need to run this script at least once to validate the libraries are present in your system
# After this, you will only need to run the "CreateDatasource" script as it will load this in memory
# 
# We would recommend to save this script in a folder that is not synchronized online as it may cause some runtime issues
# Keep the script folder trusted: dependencies are installed and loaded here, never from the caller's working directory.
########################################################################

#region Initialize Packages
    # Install the Power BI package into the script directory if it's not already installed
    if (!(Test-Path -LiteralPath (Join-Path $PSScriptRoot "Microsoft.PowerBI.Api.3.18.1") -PathType Container -ErrorAction Stop)) {
        Install-Package -Name Microsoft.PowerBi.Api -ProviderName NuGet -Scope CurrentUser -RequiredVersion 3.18.1 -SkipDependencies -Destination $PSScriptRoot -Force -ErrorAction Stop
    }

    # Install the Client Runtime package, a dependency of the Power BI package
    if (!(Test-Path -LiteralPath (Join-Path $PSScriptRoot "Microsoft.Rest.ClientRuntime.2.3.22") -PathType Container -ErrorAction Stop)) {
        Install-Package -Name Microsoft.Rest.ClientRuntime -ProviderName NuGet -Scope CurrentUser -RequiredVersion 2.3.22 -SkipDependencies -Destination $PSScriptRoot -Force -ErrorAction Stop
    }

    # Install the Newtonsoft package, another dependency of the Power BI package
    if (!(Test-Path -LiteralPath (Join-Path $PSScriptRoot "Newtonsoft.Json.11.0.2") -PathType Container -ErrorAction Stop)) {
        Install-Package -Name Newtonsoft.Json -ProviderName NuGet -Scope CurrentUser -RequiredVersion 11.0.2 -SkipDependencies -Destination $PSScriptRoot -Force -ErrorAction Stop
    }
    
    # Load the Client Runtime assembly into the session
    $crpath = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "Microsoft.Rest.ClientRuntime.2.3.22\lib\netstandard2.0\Microsoft.Rest.ClientRuntime.dll") -ErrorAction Stop
    Add-Type -Path $crpath -ErrorAction Stop

    # Load the Newtonsoft assembly into the session
    $nwpath = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "Newtonsoft.Json.11.0.2\lib\netstandard2.0\Newtonsoft.Json.dll") -ErrorAction Stop
    Add-Type -Path $nwpath -ErrorAction Stop

    # Conditionally choose the Power BI assembly to use, depending on whether you're using Windows PowerShell (version <= 5) or PowerShell Core (version >= 6)
    if ($PSVersionTable.PSVersion.Major -le 5) {
        $pbipath = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "Microsoft.PowerBI.Api.3.18.1\lib\net48\Microsoft.PowerBI.Api.dll") -ErrorAction Stop
    }
    else {
        $pbipath = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "Microsoft.PowerBI.Api.3.18.1\lib\netstandard2.0\Microsoft.PowerBI.Api.dll") -ErrorAction Stop
    }

    # Load the Power BI assembly into the session
    Add-Type -Path $pbipath -ErrorAction Stop
#endregion

# Basic Credentials
function EncryptBasicCredentials {
    param (
        [Parameter(Mandatory=$True,Position=1)]
        [String]$Username,
        [Parameter(Mandatory=$True,Position=2)] 
        [String]$PasswordAsString,
        [Parameter(Mandatory=$True,Position=3)] 
        [string]$GatewayExponent,
        [Parameter(Mandatory=$True,Position=4)] 
        [string]$GatewayModulus
    )
    
    # Create the objects to perform the necessary encryption on the credentials. Again, since I'm using basic credentials, I'm constructing a new BasicCredentials class. Other classes can be found here: https://github.com/microsoft/PowerBI-CSharp/tree/bf7cdf047a0218f7a8555fa7966445812a043955/sdk/PowerBI.Api/Extensions/Models/Credentials
    $gatewayKeyObj = [Microsoft.PowerBI.Api.Models.GatewayPublicKey]::new($GatewayExponent, $GatewayModulus)
    $credentialsEncryptor = [Microsoft.PowerBI.Api.Extensions.AsymmetricKeyEncryptor]::new($gatewayKeyObj)
    $basicCreds = [Microsoft.PowerBI.Api.Models.Credentials.BasicCredentials]::new($username, $PasswordAsString)

    # Construct the CredentialDetails object. The resulting "Credentials" property on this object will have been encrypted appropriately, ready for use in the request payload.
    $credentialDetails = [Microsoft.PowerBI.Api.Models.CredentialDetails]::new(
        $basicCreds, 
        [Microsoft.PowerBI.Api.Models.PrivacyLevel]::Organizational, 
        [Microsoft.PowerBI.Api.Models.EncryptedConnection]::Encrypted, 
        $credentialsEncryptor)
    
    # Construct the body for the API request.
    $body = @{
        credentialDetails = @{
            credentialType      = "Basic";
            credentials         = $credentialDetails.Credentials;
            encryptedConnection = "Encrypted";
            encryptionAlgorithm = "RSA-OAEP";
            privacyLevel        = "Organizational";
        }
    }
    $bodyJson = $body | ConvertTo-Json

    Write-Output $bodyJson
}

# Windows Credentials
function EncryptWindowsCredentials {
    param (
        [Parameter(Mandatory=$True,Position=1)]
        [String]$Username,
        [Parameter(Mandatory=$True,Position=2)] 
        [String]$PasswordAsString,
        [Parameter(Mandatory=$True,Position=3)] 
        [string]$GatewayExponent,
        [Parameter(Mandatory=$True,Position=4)] 
        [string]$GatewayModulus
    )
    
    # Create the objects to perform the necessary encryption on the credentials. Again, since I'm using basic credentials, I'm constructing a new BasicCredentials class. Other classes can be found here: https://github.com/microsoft/PowerBI-CSharp/tree/bf7cdf047a0218f7a8555fa7966445812a043955/sdk/PowerBI.Api/Extensions/Models/Credentials
    $gatewayKeyObj = [Microsoft.PowerBI.Api.Models.GatewayPublicKey]::new($GatewayExponent, $GatewayModulus)
    $credentialsEncryptor = [Microsoft.PowerBI.Api.Extensions.AsymmetricKeyEncryptor]::new($gatewayKeyObj)
    $WindowsCreds = [Microsoft.PowerBI.Api.Models.Credentials.WindowsCredentials]::new($username, $PasswordAsString)

    # Construct the CredentialDetails object. The resulting "Credentials" property on this object will have been encrypted appropriately, ready for use in the request payload.
    $credentialDetails = [Microsoft.PowerBI.Api.Models.CredentialDetails]::new(
        $WindowsCreds, 
        [Microsoft.PowerBI.Api.Models.PrivacyLevel]::Organizational, 
        [Microsoft.PowerBI.Api.Models.EncryptedConnection]::Encrypted, 
        $credentialsEncryptor)
    
    # Construct the body for the API request.
    $body = @{
        credentialDetails = @{
            credentialType      = "Windows";
            credentials         = $credentialDetails.Credentials;
            encryptedConnection = "Encrypted";
            encryptionAlgorithm = "RSA-OAEP";
            privacyLevel        = "Organizational";
        }
    }
    $bodyJson = $body | ConvertTo-Json

    Write-Output $bodyJson
}

# Annonymous Credentials
function EncryptAnonymousCredentials {
    param (
        [Parameter(Mandatory=$True,Position=1)] 
        [string]$GatewayExponent,
        [Parameter(Mandatory=$True,Position=2)] 
        [string]$GatewayModulus
    )
    
    # Create the objects to perform the necessary encryption on the credentials. Again, since I'm using basic credentials, I'm constructing a new BasicCredentials class. Other classes can be found here: https://github.com/microsoft/PowerBI-CSharp/tree/bf7cdf047a0218f7a8555fa7966445812a043955/sdk/PowerBI.Api/Extensions/Models/Credentials
    $gatewayKeyObj = [Microsoft.PowerBI.Api.Models.GatewayPublicKey]::new($GatewayExponent, $GatewayModulus)
    $credentialsEncryptor = [Microsoft.PowerBI.Api.Extensions.AsymmetricKeyEncryptor]::new($gatewayKeyObj)
    $AnonymousCreds = [Microsoft.PowerBI.Api.Models.Credentials.AnonymousCredentials]::new()

    # Construct the CredentialDetails object. The resulting "Credentials" property on this object will have been encrypted appropriately, ready for use in the request payload.
    $credentialDetails = [Microsoft.PowerBI.Api.Models.CredentialDetails]::new(
        $AnonymousCreds, 
        [Microsoft.PowerBI.Api.Models.PrivacyLevel]::Organizational, 
        [Microsoft.PowerBI.Api.Models.EncryptedConnection]::Encrypted, 
        $credentialsEncryptor)
    
    # Construct the body for the API request.
    $body = @{
        credentialDetails = @{
            credentialType      = "Anonymous";
            credentials         = $credentialDetails.Credentials;
            encryptedConnection = "Encrypted";
            encryptionAlgorithm = "RSA-OAEP";
            privacyLevel        = "Organizational";
        }
    }
    $bodyJson = $body | ConvertTo-Json

    Write-Output $bodyJson
}

# Oauth Credentials
function EncryptOauthCredentials {
    param (
        [Parameter(Mandatory=$True,Position=1)]
        [String]$OauthToken,
        [Parameter(Mandatory=$True,Position=3)] 
        [string]$GatewayExponent,
        [Parameter(Mandatory=$True,Position=4)] 
        [string]$GatewayModulus
    )
    
    # Create the objects to perform the necessary encryption on the credentials. Again, since I'm using basic credentials, I'm constructing a new BasicCredentials class. Other classes can be found here: https://github.com/microsoft/PowerBI-CSharp/tree/bf7cdf047a0218f7a8555fa7966445812a043955/sdk/PowerBI.Api/Extensions/Models/Credentials
    $gatewayKeyObj = [Microsoft.PowerBI.Api.Models.GatewayPublicKey]::new($GatewayExponent, $GatewayModulus)
    $credentialsEncryptor = [Microsoft.PowerBI.Api.Extensions.AsymmetricKeyEncryptor]::new($gatewayKeyObj)
    $Oauth2Creds = [Microsoft.PowerBI.Api.Models.Credentials.OAuth2Credentials]::new($OauthToken)

    # Construct the CredentialDetails object. The resulting "Credentials" property on this object will have been encrypted appropriately, ready for use in the request payload.
    $credentialDetails = [Microsoft.PowerBI.Api.Models.CredentialDetails]::new(
        $Oauth2Creds, 
        [Microsoft.PowerBI.Api.Models.PrivacyLevel]::Organizational, 
        [Microsoft.PowerBI.Api.Models.EncryptedConnection]::Encrypted, 
        $credentialsEncryptor)
    
    $body = @{
        credentialDetails = @{
            credentialType      = "OAuth2";
            credentials         = $credentialDetails.Credentials;
            encryptedConnection = "Encrypted";
            encryptionAlgorithm = "RSA-OAEP";
            privacyLevel        = "Organizational";
        }
    }
    $bodyJson = $body | ConvertTo-Json

    Write-Output $bodyJson
}

# Key Credentials
function EncryptKeyCredentials {
    param (
        [Parameter(Mandatory=$True,Position=1)]
        [String]$Key,
        [Parameter(Mandatory=$True,Position=3)] 
        [string]$GatewayExponent,
        [Parameter(Mandatory=$True,Position=4)] 
        [string]$GatewayModulus
    )
    
    # Create the objects to perform the necessary encryption on the credentials. Again, since I'm using basic credentials, I'm constructing a new BasicCredentials class. Other classes can be found here: https://github.com/microsoft/PowerBI-CSharp/tree/bf7cdf047a0218f7a8555fa7966445812a043955/sdk/PowerBI.Api/Extensions/Models/Credentials
    $gatewayKeyObj = [Microsoft.PowerBI.Api.Models.GatewayPublicKey]::new($GatewayExponent, $GatewayModulus)
    $credentialsEncryptor = [Microsoft.PowerBI.Api.Extensions.AsymmetricKeyEncryptor]::new($gatewayKeyObj)
    $KeyCreds = [Microsoft.PowerBI.Api.Models.Credentials.KeyCredentials]::new($Key)

    # Construct the CredentialDetails object. The resulting "Credentials" property on this object will have been encrypted appropriately, ready for use in the request payload.
    $credentialDetails = [Microsoft.PowerBI.Api.Models.CredentialDetails]::new(
        $KeyCreds, 
        [Microsoft.PowerBI.Api.Models.PrivacyLevel]::Organizational, 
        [Microsoft.PowerBI.Api.Models.EncryptedConnection]::Encrypted, 
        $credentialsEncryptor)
    
    $body = @{
        credentialDetails = @{
            credentialType      = "Key";
            credentials         = $credentialDetails.Credentials;
            encryptedConnection = "Encrypted";
            encryptionAlgorithm = "RSA-OAEP";
            privacyLevel        = "Organizational";
        }
    }
    $bodyJson = $body | ConvertTo-Json

    Write-Output $bodyJson
}
