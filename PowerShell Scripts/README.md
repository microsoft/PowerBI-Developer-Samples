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
| [importApi.ps1](importApi.ps1) | Import a pbix or xlsx file to a workspace  |
| [manageRefresh.ps1](manageRefresh.ps1) |  Trigger scheduled refresh and check refresh history |
| [rebindReport.ps1](rebindReport.ps1) | Clone a report in the Power BI service and rebind it to a different dataset  |
| [copyWorkspace.ps1](copyWorkspace.ps1) | Duplicate a workpsace in the Power BI service   |
| [bindToGateway.ps1](bindtogateway.ps1) | Bind a dataset to a new gateway  |
| [takeOverDataset.ps1](takeOverDataset.ps1) | Take ownership of a dataset to your account  |
| [Create-Workspace.ps1](Create-Workspace.ps1) | Create a new workspace  |
| [Create-Workspace-and-Add-Workspace-Users.ps1](Create-Workspace-and-Add-Workspace-Users.ps1) | Create a new workspace and add user as contributor   |
| [Import-PBIX-File.ps1](Import-PBIX-File.ps1) | Import PBIX into a specific target workspace  |


For Azure Resource Management (ARM) based scripts, refer [Azure-Samples/powerbi-powershell](https://github.com/Azure-Samples/powerbi-powershell).


## Prerequisites

To run the scripts in this repo, please install [PowerShell](https://aka.ms/install-powershell) and the [Azure Resource Manager PowerShell cmdlets](https://www.powershellgallery.com/packages/AzureRM/).


