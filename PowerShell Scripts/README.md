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
| [importApi.ps1](https://github.com/Azure-Samples/powerbi-powershell/blob/master/importApi.ps1) | Import a pbix or xlsx file to a workspace  |
| [manageRefresh.ps1](https://github.com/Azure-Samples/powerbi-powershell/blob/master/manageRefresh.ps1) |  Trigger scheduled refresh and check refresh history |
| [rebindReport.ps1](https://github.com/Azure-Samples/powerbi-powershell/blob/master/rebindReport.ps1) | Clone a report in the Power BI service and rebind it to a different dataset  |
| [copyWorkspace.ps1](https://github.com/Azure-Samples/powerbi-powershell/blob/master/copyWorkspace.ps1) | Duplicate a workpsace in the Power BI service   |   |
| [bindToGateway.ps1](https://github.com/Azure-Samples/powerbi-powershell/blob/master/bindtogateway.ps1) | Bind a dataset to a new gateway  |
| [takeOverDataset.ps1](https://github.com/Azure-Samples/powerbi-powershell/blob/master/takeover-dataset.ps1) | Take ownership of a dataset to your account  |

For Azure Resource Management (ARM) based scripts, refer [Azure-Samples/powerbi-powershell](https://github.com/Azure-Samples/powerbi-powershell).


## Prerequisites

To run the scripts in this repo, please install [PowerShell](https://msdn.microsoft.com/en-us/powershell/scripting/setup/installing-windows-powershell) and the [Azure Resource Manager PowerShell cmdlets](https://www.powershellgallery.com/packages/AzureRM/).


