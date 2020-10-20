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
UserOwnsData.getWorkspaces = function (getSelectParams) {
    $.ajax({
        type: "GET",
        url: "/embedinfo/getworkspace",
        data: getSelectParams,
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            // Populate select list
            for (let i = 0; i < data.length; i++) {
                UserOwnsData.workspaceSelect.append(
                    $("<option />")
                        .text(data[i].name)
                        .val(data[i].id)
                );
            }

            if (data.length >= 1) {
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
        url: "/embedinfo/getreport",
        data: getSelectParams,
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            // Populate select list
            for (let i = 0; i < data.length; i++) {
                UserOwnsData.reportSelect.append(
                    $("<option />")
                        .text(data[i].name)
                        .val(data[i].id)
                );
            }

            if (data.length >= 1) {

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
        url: "/embedinfo/getdashboard",
        data: getSelectParams,
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            // Populate select list
            for (let i = 0; i < data.length; i++) {
                UserOwnsData.dashboardSelect.append(
                    $("<option />")
                        .text(data[i].displayName)
                        .val(data[i].id)
                );
            }

            if (data.length >= 1) {

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
        url: "/embedinfo/gettile",
        data: getSelectParams,
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            // Populate select list
            for (let i = 0; i < data.length; i++) {
                UserOwnsData.tileSelect.append(
                    $("<option />")
                        .text(data[i].title)
                        .val(data[i].id)
                );
            }

            if (data.length >= 1) {

                // Enable tile select list
                UserOwnsData.tileSelect.removeAttr("disabled");
            }
        },
        error: function (err) {
            UserOwnsData.showError(err);
        }
    });
}