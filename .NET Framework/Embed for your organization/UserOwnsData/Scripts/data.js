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

// Fetch reports list from server
function getReports(getSelectParams) {
    $.ajax({
        type: "POST",
        url: "/embedinfo/getreport",
        data: JSON.stringify(getSelectParams),
        contentType: "application/json; charset=utf-8",
        success: function(data) {

            // Populate select list
            for (let i = 0; i < data.length; i++) {
                globals.reportSelect.append(
                    $("<option />")
                    .text(data[i].Name)
                    .val(data[i].Id)
                );
            }

            if (data.length >= 1) {

                // Enable report select list
                globals.reportSelect.removeAttr("disabled");
            }
        },
        error: function(err) {
            showError(err);
        }
    });
}

// Fetch dashboards list from server
function getDashboards(getSelectParams) {
    $.ajax({
        type: "POST",
        url: "/embedinfo/getdashboard",
        data: JSON.stringify(getSelectParams),
        contentType: "application/json; charset=utf-8",
        success: function(data) {

            // Populate select list
            for (let i = 0; i < data.length; i++) {
                globals.dashboardSelect.append(
                    $("<option />")
                    .text(data[i].DisplayName)
                    .val(data[i].Id)
                );
            }

            if (data.length >= 1) {

                // Enable dashboard select list
                globals.dashboardSelect.removeAttr("disabled");
            }
        },
        error: function(err) {
            showError(err);
        }
    });
}

// Fetch tiles list from server
function getTiles(getSelectParams) {
    $.ajax({
        type: "POST",
        url: "/embedinfo/gettile",
        data: JSON.stringify(getSelectParams),
        contentType: "application/json; charset=utf-8",
        success: function(data) {

            // Populate select list
            for (let i = 0; i < data.length; i++) {
                globals.tileSelect.append(
                    $("<option />")
                    .text(data[i].Title)
                    .val(data[i].Id)
                );
            }

            if (data.length >= 1) {

                // Enable tile select list
                globals.tileSelect.removeAttr("disabled");
            }
        },
        error: function(err) {
            showError(err);
        }
    });
}