// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Try to refresh user permissions after login
UserOwnsData.tryRefreshUserPermissions = function () {
    // API Endpoint to refresh user permissions
    const permissionsRefreshEndpoint = `${UserOwnsData.powerBiApi}/RefreshUserPermissions`;

    $.ajax({
        type: "POST",
        url: permissionsRefreshEndpoint,
        headers: {
            "Authorization": `Bearer ${loggedInUser.accessToken}`
        },
        contentType: "application/json; charset=utf-8",
        success: function () {
            console.log('Permissions refreshed successfully.');
        },
        error: function (err) {
            // Too many requests in one hour will cause the API to fail
            if (err.status === 429) {
                console.error("Permissions refresh will be available in up to an hour.");
            } else {
                console.error(err.responseText);
            }
        }
    });
}

// Reset report list
UserOwnsData.resetReportList = function () {
    // Clear the dropdown list and add a default value
    UserOwnsData.reportSelect.empty().append('<option value="" disabled selected>Choose report</option>');
}

// Reset dashboard list
UserOwnsData.resetDashboardList = function () {
    // Clear the dropdown list and add a default value
    UserOwnsData.dashboardSelect.empty().append('<option value="" disabled selected>Choose dashboard</option>');
}

// Reset tile list
UserOwnsData.resetTileList = function () {
    // Clear the dropdown list and add a default value
    UserOwnsData.tileSelect.empty().append('<option value="" disabled selected>Choose tile</option>');
}

// Fetch workspaces list from server
UserOwnsData.getWorkspaces = function () {
    const componentType = "workspace";
    const componentListEndpoint = `${UserOwnsData.powerBiApi}/groups`;

    // Populates workspace select list
    populateSelectList(componentType, componentListEndpoint, UserOwnsData.workspaceSelect);
}

// Fetch reports list from server
UserOwnsData.getReports = function (getSelectParams) {
    const componentType = "report";
    const componentListEndpoint = `${UserOwnsData.powerBiApi}/groups/${getSelectParams.workspaceId}/reports`;

    // Populates report select list
    populateSelectList(componentType, componentListEndpoint, UserOwnsData.reportSelect);
}

// Fetch dashboards list from server
UserOwnsData.getDashboards = function (getSelectParams) {
    const componentType = "dashboard";
    const componentListEndpoint = `${UserOwnsData.powerBiApi}/groups/${getSelectParams.workspaceId}/dashboards`;

    // Populates dashboard select list
    populateSelectList(componentType, componentListEndpoint, UserOwnsData.dashboardSelect);
}

// Fetch tiles list from server
UserOwnsData.getTiles = function (getSelectParams) {
    const componentType = "tile";
    const componentListEndpoint = `${UserOwnsData.powerBiApi}/groups/${getSelectParams.workspaceId}/dashboards/${getSelectParams.dashboardId}/tiles`;

    // Populates tile select list
    populateSelectList(componentType, componentListEndpoint, UserOwnsData.tileSelect);
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
UserOwnsData.getEmbedUrl = async function (embedParam, embedType) {
    let componentDetailsEndpoint;

    // Set endpoint for retrieving embed configurations depending on embed type
    switch(embedType.toLowerCase()) {
        case "report":
            componentDetailsEndpoint = `${UserOwnsData.powerBiApi}/groups/${embedParam.workspaceId}/reports/${embedParam.reportId}`;
            break;
        case "dashboard":
            componentDetailsEndpoint = `${UserOwnsData.powerBiApi}/groups/${embedParam.workspaceId}/dashboards/${embedParam.dashboardId}`;
            break;
        case "tile":
            componentDetailsEndpoint = `${UserOwnsData.powerBiApi}/groups/${embedParam.workspaceId}/dashboards/${embedParam.dashboardId}/tiles/${embedParam.tileId}`;
            break;
        default:
            UserOwnsData.showError("Invalid Power BI Component");
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
