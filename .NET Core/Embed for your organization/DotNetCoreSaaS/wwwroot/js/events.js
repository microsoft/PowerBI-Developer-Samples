DotNetCoreSaaS.initializeEventHandlers = function () {

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
            $(".report-wrapper").removeClass("transparent-bg");
            $(".report-wrapper").addClass("colored-bg");
            reportWrapper.show();

            // Repopulate select list for report select event
            DotNetCoreSaaS.resetReportList();
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
            DotNetCoreSaaS.resetDashboardList();
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
            DotNetCoreSaaS.resetDashboardList();
            DotNetCoreSaaS.resetTileList();
            dashboardSelect.attr("disabled", "disabled");
            tileSelect.attr("disabled", "disabled");
        }
    });

    // Workspace select event
    workspaceSelect.on("change", function () {
        let getSelectParams = {
            workspaceId: this.value
        };
        embedButton.attr("disabled", "disabled");

        // Populate select list
        if ($("#report").get(0).checked) {
            reportSelect.attr("disabled", "disabled");

            // Populate list of reports if report is checked
            DotNetCoreSaaS.resetReportList();
            DotNetCoreSaaS.getReports(getSelectParams);
        } else if ($("#dashboard").get(0).checked) {
            dashboardSelect.attr("disabled", "disabled");

            // Populate list of dashboards when dashboard radio is checked
            DotNetCoreSaaS.resetDashboardList();
            DotNetCoreSaaS.getDashboards(getSelectParams);
        } else {
            dashboardSelect.attr("disabled", "disabled");
            tileSelect.attr("disabled", "disabled");

            // Populate list of dashboards when tile radio is checked
            DotNetCoreSaaS.resetDashboardList();
            DotNetCoreSaaS.resetTileList();
            DotNetCoreSaaS.getDashboards(getSelectParams);
        }
    });

    // Report select event
    reportSelect.on("change", function () {
        embedButton.removeAttr("disabled");
    });

    // Dashboard select event
    dashboardSelect.on("change", function () {
        let getSelectParams = {
            accessToken: loggedInUser.accessToken,
            workspaceId: workspaceSelect.get(0).value
        };

        // Populate list of tiles after selecting the workspace from workspace list
        if ($("#tile").get(0).checked) {
            embedButton.attr("disabled", "disabled");
            tileSelect.attr("disabled", "disabled");
            DotNetCoreSaaS.resetTileList();
            getSelectParams.dashboardId = this.value;
            DotNetCoreSaaS.getTiles(getSelectParams);
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
        let embedParam = {
            workspaceId: workspaceSelect.get(0).value
        };

        // Report radio button is checked
        if ($("#report").get(0).checked) {
            embedParam.reportId = reportSelect.get(0).value;

            // Embed report
            DotNetCoreSaaS.embedReport(embedParam);
        }

        // Dashboard radio button is checked
        else if ($("#dashboard").get(0).checked) {
            embedParam.dashboardId = dashboardSelect.get(0).value;

            // Embed dashboard
            DotNetCoreSaaS.embedDashboard(embedParam);
        }

        // Tile radio button is checked
        else if ($("#tile").get(0).checked) {
            embedParam.dashboardId = dashboardSelect.get(0).value;
            embedParam.tileId = tileSelect.get(0).value;

            // Embed tile
            DotNetCoreSaaS.embedTile(embedParam);
        }
        embedButton.attr("disabled", "disabled");
    });
}