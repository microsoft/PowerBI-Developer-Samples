// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Reset report list
UserOwnsData.resetReportList = function () {
    const len = UserOwnsData.reportSelect.get(0).options.length;
    for (let i = 1; i < len; i++) {
        UserOwnsData.reportSelect.get(0).remove(i);
    }

    // Set default option as selected
    UserOwnsData.reportSelect.get(0).options[0].selected = true;
}

// Reset dashboard list
UserOwnsData.resetDashboardList = function () {
    const len = UserOwnsData.dashboardSelect.get(0).options.length;
    for (let i = 1; i < len; i++) {
        UserOwnsData.dashboardSelect.get(0).remove(i);
    }

    // Set default option as selected
    UserOwnsData.dashboardSelect.get(0).options[0].selected = true;
}

// Reset tile list
UserOwnsData.resetTileList = function () {
    const len = UserOwnsData.tileSelect.get(0).options.length;
    for (let i = 1; i < len; i++) {
        UserOwnsData.tileSelect.get(0).remove(i);
    }

    // Set default option as selected
    UserOwnsData.tileSelect.get(0).options[0].selected = true;
}

// Fetch workspaces list from server
UserOwnsData.getWorkspaces = function () {
    $.ajax({
        type: "GET",
        url: `${UserOwnsData.powerBiApi}/groups`,
        headers: {
            "Authorization": `Bearer ${loggedInUser.accessToken}`
        },
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            
            // Populate select list
            for (let i = 0; i < data.value.length; i++) {
                UserOwnsData.workspaceSelect.append(
                    $("<option />")
                        .text(data.value[i].name)
                        .val(data.value[i].id)
                );
            }

            if (data.value.length >= 1) {
                // Enable workspace select list
                UserOwnsData.workspaceSelect.removeAttr("disabled");
            }
        },
        error: function (err) {
            UserOwnsData.showError(err);
        }
    });
}

// Fetch reports list from server
UserOwnsData.getReports = function (getSelectParams) {
    $.ajax({
        type: "GET",
        url: `${UserOwnsData.powerBiApi}/groups/${getSelectParams.workspaceId}/reports`,
        headers: {
            "Authorization": `Bearer ${loggedInUser.accessToken}`
        },
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            // Populate select list
            for (let i = 0; i < data.value.length; i++) {
                UserOwnsData.reportSelect.append(
                    $("<option />")
                        .text(data.value[i].name)
                        .val(data.value[i].id)
                );
            }

            if (data.value.length >= 1) {

                // Enable report select list
                UserOwnsData.reportSelect.removeAttr("disabled");
            }
        },
        error: function (err) {
            UserOwnsData.showError(err);
        }
    });
}

// Fetch dashboards list from server
UserOwnsData.getDashboards = function (getSelectParams) {
    $.ajax({
        type: "GET",
        url: `${UserOwnsData.powerBiApi}/groups/${getSelectParams.workspaceId}/dashboards`,
        headers: {
            "Authorization": `Bearer ${loggedInUser.accessToken}`
        },
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            // Populate select list
            for (let i = 0; i < data.value.length; i++) {
                UserOwnsData.dashboardSelect.append(
                    $("<option />")
                        .text(data.value[i].displayName)
                        .val(data.value[i].id)
                );
            }

            if (data.value.length >= 1) {

                // Enable dashboard select list
                UserOwnsData.dashboardSelect.removeAttr("disabled");
            }
        },
        error: function (err) {
            UserOwnsData.showError(err);
        }
    });
}

// Fetch tiles list from server
UserOwnsData.getTiles = function (getSelectParams) {
    $.ajax({
        type: "GET",
        url: `${UserOwnsData.powerBiApi}/groups/${getSelectParams.workspaceId}/dashboards/${getSelectParams.dashboardId}/tiles`,
        headers: {
            "Authorization": `Bearer ${loggedInUser.accessToken}`
        },
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            // Populate select list
            for (let i = 0; i < data.value.length; i++) {
                UserOwnsData.tileSelect.append(
                    $("<option />")
                        .text(data.value[i].title)
                        .val(data.value[i].id)
                );
            }

            if (data.value.length >= 1) {

                // Enable tile select list
                UserOwnsData.tileSelect.removeAttr("disabled");
            }
        },
        error: function (err) {
            UserOwnsData.showError(err);
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
