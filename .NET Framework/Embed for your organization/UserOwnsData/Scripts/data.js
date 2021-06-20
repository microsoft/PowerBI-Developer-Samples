// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Reset report list
function resetReportList() {
    // Clear the dropdown list and add a default value
    globals.reportSelect.empty().append('<option value="" disabled selected>Choose report</option>');
}

// Reset dashboard list
function resetDashboardList() {
    // Clear the dropdown list and add a default value
    globals.dashboardSelect.empty().append('<option value="" disabled selected>Choose dashboard</option>');
}

// Reset tile list
function resetTileList() {
    // Clear the dropdown list and add a default value
    globals.tileSelect.empty().append('<option value="" disabled selected>Choose tile</option>');
}

// Fetch workspaces list from Power BI
globals.getWorkspaces = function () {
    const componentType = "workspace";
    const componentListEndpoint = `${globals.powerBiApi}/groups`;

    // Populates workspace select list
    populateSelectList(componentType, componentListEndpoint, globals.workspaceSelect);
}

// Fetch reports list from Power BI
function getReports(getSelectParams) {
    const componentType = "report";
    const componentListEndpoint = `${globals.powerBiApi}/groups/${getSelectParams.workspaceId}/reports`;

    // Populates report select list
    populateSelectList(componentType, componentListEndpoint, globals.reportSelect);
}

// Fetch dashboards list from Power BI
function getDashboards(getSelectParams) {
    const componentType = "dashboard";
    const componentListEndpoint = `${globals.powerBiApi}/groups/${getSelectParams.workspaceId}/dashboards`;

    // Populates dashboard select list
    populateSelectList(componentType, componentListEndpoint, globals.dashboardSelect);
}

// Fetch tiles list from Power BI
function getTiles(getSelectParams) {
    const componentType = "tile";
    const componentListEndpoint = `${globals.powerBiApi}/groups/${getSelectParams.workspaceId}/dashboards/${getSelectParams.dashboardId}/tiles`;

    // Populates tile select list
    populateSelectList(componentType, componentListEndpoint, globals.tileSelect);
}

// Populates select list
function populateSelectList(componentType, componentListEndpoint, componentContainer) {
    let componentDisplayName;

    // Set component select list display name depending on embed type
    switch (componentType.toLowerCase()) {
        case "workspace":
        case "report":
            componentDisplayName = "name";
            break;
        case "dashboard":
            componentDisplayName = "displayName";
            break;
        case "tile":
            componentDisplayName = "title";
            break;
        default:
            showError("Invalid Power BI Component");
    }

    // Fetch component list from Power BI
    $.ajax({
        type: "GET",
        url: componentListEndpoint,
        headers: {
            "Authorization": `Bearer ${loggedInUser.accessToken}`
        },
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            // Sort dropdown list
            let sortedList = data.value.sort((a, b) => (a[componentDisplayName].toLowerCase() > b[componentDisplayName].toLowerCase()) ? 1 : -1);

            // Populate select list
            for (let i = 0; i < sortedList.length; i++) {
                // Show id in option if title property is empty
                componentContainer.append(
                    $("<option />")
                        .text(sortedList[i][componentDisplayName] || sortedList[i].id)
                        .val(sortedList[i].id)
                );
            }

            if (sortedList.length >= 1) {

                // Enable tile select list
                componentContainer.removeAttr("disabled");
            }
        },
        error: function(err) {
            showError(err);
        }
    });
}

// Retrieves embed configuration for Power BI report, dashboard and tile
globals.getEmbedUrl = async function (embedParam, embedType) {
    let componentDetailsEndpoint;

    // Set endpoint for retrieving embed configurations depending on embed type
    switch (embedType.toLowerCase()) {
        case "report":
            componentDetailsEndpoint = `${globals.powerBiApi}/groups/${embedParam.workspaceId}/reports/${embedParam.reportId}`;
            break;
        case "dashboard":
            componentDetailsEndpoint = `${globals.powerBiApi}/groups/${embedParam.workspaceId}/dashboards/${embedParam.dashboardId}`;
            break;
        case "tile":
            componentDetailsEndpoint = `${globals.powerBiApi}/groups/${embedParam.workspaceId}/dashboards/${embedParam.dashboardId}/tiles/${embedParam.tileId}`;
            break;
        default:
            showError("Invalid Power BI Component");
    }

    let componentDetails = await $.ajax({
        type: "GET",
        url: componentDetailsEndpoint,
        headers: {
            "Authorization": `Bearer ${loggedInUser.accessToken}`
        },
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            return data
        }
    });

    return componentDetails.embedUrl;
}
