# This sample script calls the Power BI API to programmatically duplicate the workspace and all
# its dashboards, reports and datasets.

# For more information, see the accompanying blog post:
# https://powerbi.microsoft.com/en-us/blog/duplicate-workspaces-using-the-power-bi-rest-apis-a-step-by-step-tutorial/

# Instructions:
# 1. Install PowerShell (https://msdn.microsoft.com/en-us/powershell/scripting/setup/installing-windows-powershell) 
#    and the Azure PowerShell cmdlets (Install-Module AzureRM)
# 2. Run PowerShell as an administrator
# 3. Follow the instructions below to fill in the client ID
# 4. Change PowerShell directory to where this script is saved
# 5. > ./copyworkspace.ps1

# Parameters - fill these in before running the script!
# ======================================================

# AAD Client ID
# To get this, go to the following page and follow the steps to provision an app
# https://dev.powerbi.com/apps
# To get the sample to work, ensure that you have the following fields:
# App Type: Native app
# Redirect URL: urn:ietf:wg:oauth:2.0:oob
#  Level of access: check all boxes

$clientId = " FILL ME IN " 

# End Parameters =======================================

# TODO: move helper functions into a separate file
# Calls the Active Directory Authentication Library (ADAL) to authenticate against AAD
function GetAuthToken
{

    $redirectUri = "urn:ietf:wg:oauth:2.0:oob"

    $resourceAppIdURI = "https://analysis.windows.net/powerbi/api"

    $authority = "https://login.microsoftonline.com/common/oauth2/authorize";

    $authContext = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext" -ArgumentList $authority

    $authResult = $authContext.AcquireToken($resourceAppIdURI, $clientId, $redirectUri, "Auto")

    return $authResult
}

function get_groups_path($group_id) {
    if ($group_id -eq "me") {
        return "myorg"
    } else {
        return "myorg/groups/$group_ID"
    }
}

# PART 1: Authentication
# ==================================================================
$token = GetAuthToken

Add-Type -AssemblyName System.Net.Http
$temp_path_root = "$PSScriptRoot\pbi-copy-workspace-temp-storage"

# Building Rest API header with authorization token
$auth_header = @{
   'Content-Type'='application/json'
   'Authorization'=$token.CreateAuthorizationHeader()
}

# Prompt for user input
# ==================================================================
# Get the list of groups that the user is a member of
$uri = "https://api.powerbi.com/v1.0/myorg/groups/"
$all_groups = (Invoke-RestMethod -Uri $uri –Headers $auth_header –Method GET).value

# Ask for the source workspace name
$source_group_ID = ""
while (!$source_group_ID) {
    $source_group_name = Read-Host -Prompt "Enter the name of the workspace you'd like to copy from"

    if($source_group_name -eq "My Workspace") {
        $source_group_ID = "me"
        break
    }

    Foreach ($group in $all_groups) {
        if ($group.name -eq $source_group_name) {
            if ($group.isReadOnly -eq "True") {
                "Invalid choice: you must have edit access to the group"
                break
            } else {
                $source_group_ID = $group.id
                break
            }
        }
    }

    if(!$source_group_id) {
        "Please try again, making sure to type the exact name of the group"  
    } 
}

# Ask for the target workspace name
$target_group_ID = "" 
while (!$target_group_id) {
    try {
        $target_group_name = Read-Host -Prompt "Enter the name of the new workspace to be created"
        $uri = " https://api.powerbi.com/v1.0/myorg/groups"
        $body = "{`"name`":`"$target_group_name`"}"
        $response = Invoke-RestMethod -Uri $uri –Headers $auth_header –Method POST -Body $body
        $target_group_id = $response.id
    } catch { 
        "Could not create a group with that name. Please try again and make sure the name is not already taken"
        "More details: "
        Write-Host "StatusCode:" $_.Exception.Response.StatusCode.value__ 
        Write-Host "StatusDescription:" $_.Exception.Response.StatusDescription
        continue
    }
}

# PART 3: Copying reports and datasets using Export/Import PBIX APIs
# ==================================================================
$report_ID_mapping = @{}      # mapping of old report ID to new report ID
$dataset_ID_mapping = @{}     # mapping of old model ID to new model ID
$failure_log = @()  
$import_jobs = @()
$source_group_path = get_groups_path($source_group_ID)
$target_group_path = get_groups_path($target_group_ID)

$uri = "https://api.powerbi.com/v1.0/$source_group_path/reports/"
$reports_json = Invoke-RestMethod -Uri $uri –Headers $auth_header –Method GET
$reports = $reports_json.value

# For My Workspace, filter out reports that I don't own - e.g. those shared with me
if ($source_group_ID -eq "me") {
    $reports_temp = @()
    Foreach($report in $reports) {
        if ($report.isOwnedByMe -eq "True") {
            $reports_temp += $report
        }
    }
    $reports = $reports_temp
}

# == Export/import the reports that are built on PBIXes (this step creates the datasets)
# for each report, try exporting and importing the PBIX
New-Item -Path $temp_path_root -ItemType Directory 
"=== Exporting PBIX files to copy datasets..."
Foreach($report in $reports) {
   
    $report_id = $report.id
    $dataset_id = $report.datasetId
    $report_name = $report.name
    $temp_path = "$temp_path_root\$report_name.pbix"

    # only export if this dataset hasn't already been seen
    if ($dataset_ID_mapping[$dataset_id]) {
        continue
    }

    "== Exporting $report_name with id: $report_id to $temp_path"
    $uri = "https://api.powerbi.com/v1.0/$source_group_path/reports/$report_id/Export"
    try {
        Invoke-RestMethod -Uri $uri –Headers $auth_header –Method GET -OutFile "$temp_path"
    } catch {
        Write-Host "= This report and dataset cannot be copied, skipping. This is expected for most workspaces."
        continue
    }
     
    try {
        "== Importing $report_name to target workspace"
        $uri = "https://api.powerbi.com/v1.0/$target_group_path/imports/?datasetDisplayName=$report_name.pbix&nameConflict=Abort"

        # Here we switch to HttpClient class to help POST the form data for importing PBIX
        $httpClient = New-Object System.Net.Http.Httpclient $httpClientHandler
        $httpClient.DefaultRequestHeaders.Authorization = New-Object System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", $token.AccessToken);
        $packageFileStream = New-Object System.IO.FileStream @($temp_path, [System.IO.FileMode]::Open)
        
	    $contentDispositionHeaderValue = New-Object System.Net.Http.Headers.ContentDispositionHeaderValue "form-data"
	    $contentDispositionHeaderValue.Name = "file0"
	    $contentDispositionHeaderValue.FileName = $file_name
 
        $streamContent = New-Object System.Net.Http.StreamContent $packageFileStream
        $streamContent.Headers.ContentDisposition = $contentDispositionHeaderValue
        
        $content = New-Object System.Net.Http.MultipartFormDataContent
        $content.Add($streamContent)

	    $response = $httpClient.PostAsync($Uri, $content).Result
 
	    if (!$response.IsSuccessStatusCode) {
		    $responseBody = $response.Content.ReadAsStringAsync().Result
            "= This report cannot be imported to target workspace. Skipping..."
			$errorMessage = "Status code {0}. Reason {1}. Server reported the following message: {2}." -f $response.StatusCode, $response.ReasonPhrase, $responseBody
			throw [System.Net.Http.HttpRequestException] $errorMessage
		} 
        
        # save the import IDs
        $import_job_id = (ConvertFrom-JSON($response.Content.ReadAsStringAsync().Result)).id

        # wait for import to complete
        $upload_in_progress = $true
        while($upload_in_progress) {
            $uri = "https://api.powerbi.com/v1.0/$target_group_path/imports/$import_job_id"
            $response = Invoke-RestMethod -Uri $uri –Headers $auth_header –Method GET
            
            if ($response.importState -eq "Succeeded") {
                "Publish succeeded!"
                # update the report and dataset mappings
                $report_id_mapping[$report_id] = $response.reports[0].id
                $dataset_id_mapping[$dataset_id] = $response.datasets[0].id
                break
            }

            if ($response.importState -ne "Publishing") {
                "Error: publishing failed, skipping this. More details: "
                $response
                break
            }
            
            Write-Host -NoNewLine "."
            Start-Sleep -s 5
        }
            
        
    } catch [Exception] {
        Write-Host $_.Exception
	    Write-Host "== Error: failed to import PBIX"
        Write-Host "= HTTP Status Code:" $_.Exception.Response.StatusCode.value__ 
        Write-Host "= HTTP Status Description:" $_.Exception.Response.StatusDescription
        continue
    }
}


# PART 4: Clone the remainder of the reports
# ==================================================================
"=== Cloning reports" 
Foreach($report in $reports) {
    $report_name = $report.name
    $report_id = $report.id

    # Clone report if the underlying dataset already exists in the target workspace, but we haven't moved the report itself yet
    $target_dataset_Id = $dataset_id_mapping[$report.datasetId]
    if ($target_dataset_Id -and !$report_ID_mapping[$report.id]) {
        "== Cloning report $report_name"
        $uri = " https://api.powerbi.com/v1.0/$source_group_path/reports/$report_id/Clone"
        $body = "{`"name`":`"$report_name`",`"targetWorkspaceId`": `"$target_group_id`", `"targetModelId`": `"$target_dataset_Id`"}"
        $response = Invoke-RestMethod -Uri $uri –Headers $auth_header –Method POST -Body $body
        $report_ID_mapping[$report_id] = $response.id
    } else {
        $failure_log += $report
    }
}


# PART 5: Copy dashboards
# ==================================================================
"=== Cloning dashboards" 
# get all dashboards in a workspace
$uri = "https://api.powerbi.com/v1.0/$source_group_path/dashboards/"
$dashboards = (Invoke-RestMethod -Uri $uri –Headers $auth_header –Method GET).value

# For My Workspace, filter out dashboards that I don't own - e.g. those shared with me
if ($source_group_ID -eq "me") {
    $dashboards_temp = @()
    Foreach($dashboard in $dashboards) {
        if ($dashboard.isReadOnly -ne "True") {
            $dashboards_temp += $dashboard
        }
    }
    $dashboards = $dashboards_temp
}

Foreach ($dashboard in $dashboards) {
    $dashboard_id = $dashboard.id
    $dashboard_name = $dashboard.displayName

    "== Cloning dashboard: $dashboard_name"

    # create new dashboard in the target workspace
    $uri = "https://api.powerbi.com/v1.0/$target_group_path/dashboards"
    $body = "{`"name`":`"$dashboard_name`"}"
    $response = Invoke-RestMethod -Uri $uri –Headers $auth_header –Method POST -Body $body
    $target_dashboard_id = $response.id

    " = Cloning individual tiles..." 
    # copy over tiles:
    $uri = "https://api.powerbi.com/v1.0/$source_group_path/dashboards/$dashboard_id/tiles"
    $response = Invoke-RestMethod -Uri $uri –Headers $auth_header –Method GET 
    $tiles = $response.value
    Foreach ($tile in $tiles) {
        try {
            $tile_id = $tile.id
            $tile_report_Id = $tile.reportId
            $tile_dataset_Id = $tile.datasetId
            if ($tile_report_id) { $tile_target_report_id = $report_id_mapping[$tile_report_id] }
            if ($tile_dataset_id) { $tile_target_dataset_id = $dataset_id_mapping[$tile_dataset_id] }

            # clone the tile only if a) it is not built on a dataset or b) if it is built on a report and/or dataset that we've moved
            if (!$tile_report_id -Or $dataset_id_mapping[$tile_dataset_id]) {
                $uri = " https://api.powerbi.com/v1.0/$source_group_path/dashboards/$dashboard_id/tiles/$tile_id/Clone"
                $body = @{}
                $body["TargetDashboardId"] = $target_dashboard_id
                $body["TargetWorkspaceId"] = $target_group_id
                if ($tile_report_id) { $body["TargetReportId"] = $tile_target_report_id } 
                if ($tile_dataset_id) { $body["TargetModelId"] = $tile_target_dataset_id } 
                $jsonBody = ConvertTo-JSON($body)
                $response = Invoke-RestMethod -Uri $uri –Headers $auth_header –Method POST -Body $jsonBody
                Write-Host -NoNewLine "."
            } else {
                $failure_log += $tile
            } 
           
        } catch [Exception] {
            "Error: skipping tile..."
            Write-Host $_.Exception
        }
    }
    "Done!"
}

"Cleaning up temporary files"
Remove-Item -path $temp_path_root -Recurse