// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Reset report list
function resetReportList() {
    let len = globals.reportSelect.get(0).options.length;
    for (let i = 1; i < len; i++) {
        globals.reportSelect.get(0).remove(i);
    }

    // Set default option as selected
    globals.reportSelect.get(0).options[0].selected = true;
}

// Reset dashboard list
function resetDashboardList() {
    let len = globals.dashboardSelect.get(0).options.length;
    for (let i = 1; i < len; i++) {
        globals.dashboardSelect.get(0).remove(i);
    }

    // Set default option as selected
    globals.dashboardSelect.get(0).options[0].selected = true;
}

// Reset tile list
function resetTileList() {
    let len = globals.tileSelect.get(0).options.length;
    for (let i = 1; i < len; i++) {
        globals.tileSelect.get(0).remove(i);
    }

    // Set default option as selected
    globals.tileSelect.get(0).options[0].selected = true;
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

            // Populate select list
            for (let i = 0; i < data.value.length; i++) {
                componentContainer.append(
                    $("<option />")
                        .text(data.value[i][componentDisplayName])
                        .val(data.value[i].id)
                );
            }

            if (data.value.length >= 1) {

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
