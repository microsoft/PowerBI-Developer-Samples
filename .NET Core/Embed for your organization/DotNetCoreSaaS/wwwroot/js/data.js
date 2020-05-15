// Reset report list
function resetReportList() {
    var len = reportSelect.get(0).options.length;
    for (var i = 1; i < len; i++) {
        reportSelect.get(0).remove(i);
    }

    // Set default option as selected
    reportSelect.get(0).options[0].selected = true;
}

// Reset dashboard list
function resetDashboardList() {
    var len = dashboardSelect.get(0).options.length;
    for (var i = 1; i < len; i++) {
        dashboardSelect.get(0).remove(i);
    }

    // Set default option as selected
    dashboardSelect.get(0).options[0].selected = true;
}

// Reset tile list
function resetTileList() {
    var len = tileSelect.get(0).options.length;
    for (var i = 1; i < len; i++) {
        tileSelect.get(0).remove(i);
    }

    // Set default option as selected
    tileSelect.get(0).options[0].selected = true;
}

// Fetch workspaces list from server
function getWorkspaces(getSelectParams) {
    $.ajax({
        type: "GET",
        url: "/embedinfo/getworkspace",
        data: getSelectParams,
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            // Populate select list
            for (var i = 0; i < data.length; i++) {
                workspaceSelect.append(
                    $("<option />")
                        .text(data[i].name)
                        .val(data[i].id)
                );
            }

            if (data.length >= 1) {

                // Enable workspace select list
                workspaceSelect.removeAttr("disabled");
            }
        },
        error: function (err) {
            showError(err);
        }
    });
}

// Fetch reports list from server
function getReports(getSelectParams) {
    $.ajax({
        type: "GET",
        url: "/embedinfo/getreport",
        data: getSelectParams,
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            // Populate select list
            for (var i = 0; i < data.length; i++) {
                reportSelect.append(
                    $("<option />")
                        .text(data[i].name)
                        .val(data[i].id)
                );
            }

            if (data.length >= 1) {

                // Enable report select list
                reportSelect.removeAttr("disabled");
            }
        },
        error: function (err) {
            showError(err);
        }
    });
}

// Fetch dashboards list from server
function getDashboards(getSelectParams) {
    $.ajax({
        type: "GET",
        url: "/embedinfo/getdashboard",
        data: getSelectParams,
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            // Populate select list
            for (var i = 0; i < data.length; i++) {
                dashboardSelect.append(
                    $("<option />")
                        .text(data[i].displayName)
                        .val(data[i].id)
                );
            }

            if (data.length >= 1) {

                // Enable dashboard select list
                dashboardSelect.removeAttr("disabled");
            }
        },
        error: function (err) {
            showError(err);
        }
    });
}

// Fetch tiles list from server
function getTiles(getSelectParams) {
    $.ajax({
        type: "GET",
        url: "/embedinfo/gettile",
        data: getSelectParams,
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            // Populate select list
            for (var i = 0; i < data.length; i++) {
                tileSelect.append(
                    $("<option />")
                        .text(data[i].title)
                        .val(data[i].id)
                );
            }

            if (data.length >= 1) {

                // Enable tile select list
                tileSelect.removeAttr("disabled");
            }
        },
        error: function (err) {
            showError(err);
        }
    });
}