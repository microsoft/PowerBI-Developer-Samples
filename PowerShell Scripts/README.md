---
languages:
- powershell
products:
- power-bi
page_type: sample
description: "Samples for calling the Power BI REST APIs using PowerShell."
---

# Microsoft Power BI PowerShell samples

## Introduction

This repo contains samples for calling the Power BI REST APIs using PowerShell. Each PowerShell script is self-documenting.

| Script |Description |
|----|:---|
| [Admin-Create-Workspace-Inventory-Report.ps1](Admin-Create-Workspace-Inventory-Report.ps1) | Run as admin to get inventory report for workspace |
| [Admin-Get-All-Workspaces-in-Tenant.ps1](Admin-Get-All-Workspaces-in-Tenant.ps1) | Run as admin to get list all of asctive workspace in current tenant |
| [bindToGateway.ps1](bindtogateway.ps1) | Bind a dataset to a new gateway  |
| [copyWorkspace.ps1](copyWorkspace.ps1) | Duplicate a workpsace in the Power BI service   |
| [Create-Workspace-and-Add-Workspace-Users.ps1](Create-Workspace-and-Add-Workspace-Users.ps1) | Create a new workspace and add user as contributor   |
| [Create-Workspace.ps1](Create-Workspace.ps1) | Create a new workspace  |
| [DeploymentPipelines-AddUserToPipeline.ps1](DeploymentPipelines-AddUserToPipeline.ps1) | Add a user as an admin to a deployment pipeline |
| [DeploymentPipelines-DeployAll.ps1](DeploymentPipelines-DeployAll.ps1) | Starts a deployment of all contnet between two stages in the pipeline |
| [DeploymentPipelines-E2ESampleFromPipelineCreationToDeployment.ps1](DeploymentPipelines-E2ESampleFromPipelineCreationToDeployment.ps1) | End to end sample - create a pipeline, assign a workspace to Production and backward deploy to Test and Development |
| [DeploymentPipelines-SelectiveDeploy.ps1](DeploymentPipelines-SelectiveDeploy.ps1) | Starts a deployment of specific contnet between two stages in the pipeline |
| [DeploymentPipelines-WaitForDeployment.ps1](DeploymentPipelines-WaitForDeployment.ps1) | Waits for the deployment operation to be completed |
| [Import-PBIX-File.ps1](Import-PBIX-File.ps1) | Import PBIX into a target workspace  |
| [Login-User-Interactively.ps1](Login-User-Interactively.ps1) | Login user interactively as script runs |
| [Login-User-Unattended.ps1](Login-User-Unattended.ps1) | Login user automatically using hard-coded user name and password |
| [Patch-Anonymous-Datasource-Credentials-and-Refresh.ps1](Patch-Anonymous-Datasource-Credentials-and-Refresh.ps1) | Patch credentials for anonymous datasource and start dataset refresh operation |
| [Patch-SQL-Datasource-Credentials-and-Refresh.ps1](Patch-SQL-Datasource-Credentials-and-Refresh.ps1) | Patch credentials for Azure SQL datasource and start dataset refresh operation |
| [manageRefresh.ps1](manageRefresh.ps1) |  Trigger scheduled refresh and check refresh history |
| [rebindReport.ps1](rebindReport.ps1) | Clone a report in the Power BI service and rebind it to a different dataset  |
| [takeOverDataset.ps1](takeOverDataset.ps1) | Take ownership of a dataset to your account |
| [Update-Connection-Details-for-Sql-Datasource.ps1](Update-Connection-Details-for-Sql-Datasource.ps1) | Update server name and/or database name for Azure SQL datasource |
| [Update-Dataset-Parameters.ps1](Update-Dataset-Parameters.ps1) | Update dataset parameter |
| | |



For Azure Resource Management (ARM) based scripts, refer [Azure-Samples/powerbi-powershell](https://github.com/Azure-Samples/powerbi-powershell).


## Prerequisites

To run the scripts in this repo, please install [PowerShell](https://aka.ms/install-powershell) and the [Azure Resource Manager PowerShell cmdlets](https://www.powershellgallery.com/packages/AzureRM/).


