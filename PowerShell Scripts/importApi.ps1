#Sample PowerShell Script for usage of PowerBI Rest API https://docs.microsoft.com/en-us/rest/api/power-bi/imports/postimport

########################### README ##################################################
#This is a SAMPLE powershell script that you can use as REFERENCE to CREATE YOUR OWN CODE.
#Please note that this source code is freeware and is provided on an 'as is' basis without warranties of any kind,
#whether express or implied, including without limitation warranties that the code is free of defect,fit for a particular purpose or non - infringing.
#The entire risk as to the quality and performance of the code is with the end user.
#####################################################################################

#region Parameters
$clientId = "" #app client id
$groupID = "me" # the ID of the workspace where you want to import. Use "me" if you want to import to your "My workspace"
$datasetName = "demo1.pbix" # the name of the dataset we will import, the value passed must contain the file extension .pbix or .xlsx
$flPath = "C:\temp\sample\" # the path for the file
$fl = "Test.pbix" #the filename(with extension) which will be imported
$xlsxmode ="connect" # applicable if you're trying to import a xlsx file. This is the mode for the xlsx file import, you can have "connect" or "import"

$redirectUri = "urn:ietf:wg:oauth:2.0:oob"
$resourceAppIdURI = "https://analysis.windows.net/powerbi/api"
$authority = "https://login.microsoftonline.com/common/oauth2/authorize";

$enc = [System.Text.Encoding]::GetEncoding("iso-8859-1") 

#endregion Parameters

#region Validation of the input parameters =======================================

Try{
    if ($fl -ne $null){
        $rpExt=$fl.split(".")[-1]
        if ($rpExt -eq "xlsx" -or $rpExt -eq "pbix"){ #confirm that the file being imported is either xlsx or pbix
            if ($rpExt -eq "xlsx"){
                if ($xlsxmode -eq "connect" -or $xlsxmode -eq "import"){  #confirm if xlsx, if the mode is correct
                        if (!(Test-Path -Path ($flpath + $fl))) { #confirm if the filpath is valid and if the file exists.
                            Write-Host "The file cannot be accessed, please confirm the filepath is valid, the file exists and the user has permissions to access it"
                            Break            
                        }
                }else {
                    Write-Host "The mode is invalid for xlsx import, you must choose connect or import"
                    Break        
                }
            }

            # properly format groups path
            $groupsPath = ""
            if ($groupID -eq "me" -or $groupID -eq $null) {
	            $groupsPath = "myorg"
            } else {
                #groupid is not empty, me or null, so we need to ensure it's a valid guid
	            [regex]$guidRegex = '(?im)^[{(]?[0-9A-F]{8}[-]?(?:[0-9A-F]{4}[-]?){3}[0-9A-F]{12}[)}]?$'
	                                
	            if ($groupID -match $guidRegex){ 
                    $groupsPath = "myorg/groups/$groupID"
                }else {
                    Write-Host "You need to specify a valid workspace id"
                    Break
                                 
	            }
            }
            
        }else {
            Write-Host "The file to import must be a pbix or xlsx file"
            Break
        }
	}else {
		Write-Host "The file parameter was not set, please set the file name and extension"
        Break
         
	}
}Catch
    {
        $ErrorMessage = $_.Exception.Message
        Write-Host "An exception has occurred on the validation of the input parameters, exception details:$endLine Message:$ErrorMessage$endLine"  -ForegroundColor Red
        Break
    }
#endregion Validation of the input parameters
Write-Host "Validation of the input parameters finished with success." -ForegroundColor Green 

#region Function definitions =======================================
# Call to the Active Directory Authentication Library to authenticate against AAD
function GetAuthToken{
       Try{
           if (-not (Get-Module AzureRm.Profile)) {
             Import-Module AzureRm.Profile
           }

           $authContext = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext" -ArgumentList $authority
           $authResult = $authContext.AcquireToken($resourceAppIdURI, $clientId, $redirectUri, "Auto")

           return $authResult
        }Catch
        {
            $ErrorMessage = $_.Exception.Message
            Write-Host "An exception has occurred on GetAuthToken function, exception details:$endLine Message:$ErrorMessage$endLine" -ForegroundColor Red
            Break
        }
}

function GetBody{#function to prepare the body
	Param(
			 [Parameter(Mandatory=$true, Position=0)]
			 [string] $nb,	#boundary
             [Parameter(Mandatory=$true, Position=1)]
			 [string] $fExt	#fileExtension
	)
       $bodyLines = ""
       $endLine = [System.Environment]::NewLine
    Try{
	    $flB = [IO.File]::ReadAllBytes($flPath+$fl)	
	    if ($fExt -eq "xlsx"){
            $flE = $enc.GetString($flB)
		    $bodyLines = (
			"",
			"--$nb",
			'Content-Disposition: form-data;name="connectionType"',
			"",$xlsxmode,"--$nb","Content-Disposition: form-data; name='publish-file'; filename='$datasetName'","Content-Type: application/octet-stream$endLine",
			$flE,
			"--$nb--$endLine") -join $endLine
	    }elseif ($fExt -eq "pbix"){
		    $flE = $enc.GetString($flB)
		    $bodyLines = (
			"$nb",
			"Content-Disposition: form-data; name='$datasetName'; filename='$fl'",
			"Content-Type: application/x-zip-compressed$endLine",
			$flE,
			"$nb--$endLine") -join $endLine
	    }
        return $bodyLines
    }Catch
    {
        $ErrorMessage = $_.Exception.Message
        Write-Host "An exception has occurred on GetBody function, exception details:$endLine Message:$ErrorMessage$endLine" -ForegroundColor Red
        Break
    }

}

function Import{
	Param(
			 [Parameter(Mandatory=$true, Position=0)]
			 [string] $groupsPath	#groupsPath
	)
	#Call the Import API
    Try{
	    $uri = "https://api.powerbi.com/v1.0/$groupsPath/imports?nameConflict=Abort&datasetDisplayName=$datasetName"
	    $response = Invoke-RestMethod -Uri $uri -Headers $authHeader -Body $body -Method POST -Verbose
	    return $response.id
    }Catch
    {
        Write-Host "An exception has occurred on calling the Import function, exception details:" -ForegroundColor Red
        Write-Host "StatusCode:" $_.Exception.Response.StatusCode.value__ -ForegroundColor Red
		Write-Host "RequestId:" $_.Exception.Response.Headers["RequestId"] -ForegroundColor Red
		Write-Host "ActivityId:" $_.Exception.Response.Headers["ActivityId"] -ForegroundColor Red
        Write-Host "StatusDescription:" $_.Exception.Response.StatusDescription -ForegroundColor Red
        Break
    }
}

function GetImportResult{#Get the result for the import
	Param(
			 [Parameter(Mandatory=$true, Position=0)]
			 [string] $id
	)
    
    $uri = "https://api.powerbi.com/v1.0/$groupsPath/imports/$id"
    
    Try{

        $state="Publishing"; #initial state
        do{ 
            Start-Sleep -s 2 #sleep 2 seconds between each attempt and retry
            $response = Invoke-RestMethod -Uri $uri -Headers $authHeader -Method GET -Verbose #invoke the rest method to get the import result
            $state=$response.importState

          }while ($state -eq "Publishing")

          Write-Host "Getting the Import result finished with success:" -ForegroundColor Green
          Write-Host $response

    }Catch
    {
         Write-Host "An exception has occurred on calling the GetImportResult function, exception details:" -ForegroundColor Red
         Write-Host "StatusCode:" $_.Exception.Response.StatusCode.value__ -ForegroundColor Red
		 Write-Host "RequestId:" $_.Exception.Response.Headers["RequestId"] -ForegroundColor Red
		 Write-Host "ActivityId:" $_.Exception.Response.Headers["ActivityId"] -ForegroundColor Red
         Write-Host "StatusDescription:" $_.Exception.Response.StatusDescription -ForegroundColor Red

         Break
    }
}

#endregion Function definitions

Try{
    # Get the auth token from AAD
    $token = GetAuthToken
    $nb = "--SamplePowerShellBoundary"  #boundary generation

    # Building Rest API header with authorization token
    $authHeader = @{
        'Content-Type'='multipart/form-data; boundary='+$nb
        'Accept'='application/json, text/plain, */*'
        'Authorization'=$token.CreateAuthorizationHeader()
        
    }

    Write-Host "Building the request header finished with success." -ForegroundColor Green

    $body = GetBody $nb $rpExt #get the body for the post request

    if ($null -ne $body){ 
        Write-Host "Building the request body finished with success." -ForegroundColor Green
        $resp = Import($groupsPath) #call the import function
        if ($null -ne $resp) {
            Write-Host "The Import request finished with success, ImportId:$resp" -ForegroundColor Green
            GetImportResult($resp) #check the result
        }
    }

}Catch
{
    $ErrorMessage = $_.Exception.Message
    Write-Host "An exception has occurred on the script execution, exception details:$endLine Message:$ErrorMessage$endLine" -ForegroundColor Red
    Break
}
