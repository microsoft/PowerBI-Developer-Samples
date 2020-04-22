function initializeEventHandlers() {

    // Sign-in button click event
    $(".sign-in").on("click", function () {
        signIn();
    });

    // Radio button handle event
    $("input[type=radio]").on("click", function () {
        workspaceDefaultOption.selected = "true";

        // When report radio button is clicked
        if ($("#report").get(0).checked) {
            dashboardDiv.hide();
            tileDiv.hide();
            reportDiv.show();
            reportContainer.hide();
            reportDisplayText.show();
            dashboardWrapper.hide();
            tileWrapper.hide();
            $(".report-wrapper").css({ "background-color": "#EAEAEA" });
            reportWrapper.show();

            // Repopulate select list for report select event
            resetReportList();
            reportSelect.attr("disabled", "disabled");
        }

        // When dashboard radio button is clicked
        else if ($("#dashboard").get(0).checked) {
            reportDiv.hide();
            tileDiv.hide();
            dashboardDiv.show();
            dashboardContainer.hide();
            dashboardDisplayText.show();
            reportWrapper.hide();
            tileWrapper.hide();
            dashboardWrapper.show();

            // Repopulate select list for dashboard select event
            resetDashboardList();
            dashboardSelect.attr("disabled", "disabled");
        }

        // When radio button for tile is clicked
        else if ($("#tile").get(0).checked) {
            reportDiv.hide();
            dashboardDiv.show();
            tileDiv.show();
            tileContainer.hide();
            tileDisplayText.show();
            reportWrapper.hide();
            dashboardWrapper.hide();
            tileWrapper.show();

            // Repopulate select lists for tile select event
            resetDashboardList();
            resetTileList();
            dashboardSelect.attr("disabled", "disabled");
            tileSelect.attr("disabled", "disabled");
        }
    });

    // Workspace select event
    workspaceSelect.on("change", function () {
        var getSelectParams = {
            accessToken: loggedInUser.accessToken,
            workspaceId: this.value
        };
        embedButton.attr("disabled", "disabled");

        // Populate select list
        if ($("#report").get(0).checked) {
            reportSelect.attr("disabled", "disabled");

            // Populate list of reports if report is checked
            resetReportList();
            getReports(getSelectParams);
        } else if ($("#dashboard").get(0).checked) {
            dashboardSelect.attr("disabled", "disabled");

            // Populate list of dashboards when dashboard radio is checked
            resetDashboardList();
            getDashboards(getSelectParams);
        } else {
            dashboardSelect.attr("disabled", "disabled");
            tileSelect.attr("disabled", "disabled");

            // Populate list of dashboards when tile radio is checked
            resetDashboardList();
            resetTileList();
            getDashboards(getSelectParams);
        }
    });

    // Report select event
    reportSelect.on("change", function () {
        embedButton.removeAttr("disabled");
    });

    // Dashboard select event
    dashboardSelect.on("change", function () {
        var getSelectParams = {
            accessToken: loggedInUser.accessToken,
            workspaceId: workspaceSelect.get(0).value
        };

        // Populate list of tiles after selecting the workspace from workspace list
        if ($("#tile").get(0).checked) {
            embedButton.attr("disabled", "disabled");
            tileSelect.attr("disabled", "disabled");
            resetTileList();
            getSelectParams.dashboardId = this.value;
            getTiles(getSelectParams);
        }

        // Enable embedButton when dashboard is selected
        else {
            embedButton.removeAttr("disabled");
        }
    });

    // Tile select event
    tileSelect.on("change", function () {
        embedButton.removeAttr("disabled");
    });

    // Embed content on button click
    embedButton.on("click", function () {
        var embedParam = {
            accessToken: loggedInUser.accessToken,
            workspaceId: workspaceSelect.get(0).value
        };

        // Report radio button is checked
        if ($("#report").get(0).checked) {
            embedParam.reportId = reportSelect.get(0).value;

            // Embed report
            embedReport(embedParam);
        }

        // Dashboard radio button is checked
        else if ($("#dashboard").get(0).checked) {
            embedParam.dashboardId = dashboardSelect.get(0).value;

            // Embed dashboard
            embedDashboard(embedParam);
        }

        // Tile radio button is checked
        else if ($("#tile").get(0).checked) {
            embedParam.dashboardId = dashboardSelect.get(0).value;
            embedParam.tileId = tileSelect.get(0).value;

            // Embed tile
            embedTile(embedParam);
        }
        embedButton.attr("disabled", "disabled");
    });
}