// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

UserOwnsData.initializeEventHandlers = function () {

    // Radio button handle event
    $("input[type=radio]").on("click", function () {
        UserOwnsData.workspaceDefaultOption.selected = "true";

        // When report radio button is clicked
        if ($("#report").get(0).checked) {
            UserOwnsData.dashboardDiv.hide();
            UserOwnsData.tileDiv.hide();
            UserOwnsData.reportDiv.show();
            UserOwnsData.reportContainer.hide();
            UserOwnsData.reportSpinner.hide();
            UserOwnsData.reportDisplayText.show();
            UserOwnsData.dashboardWrapper.hide();
            UserOwnsData.tileWrapper.hide();
            $(".report-wrapper").removeClass("transparent-bg");
            $(".report-wrapper").addClass("colored-bg");
            UserOwnsData.reportWrapper.show();

            // Repopulate select list for report select event
            UserOwnsData.resetReportList();
            UserOwnsData.reportSelect.attr("disabled", "disabled");
        }

        // When dashboard radio button is clicked
        else if ($("#dashboard").get(0).checked) {
            UserOwnsData.reportDiv.hide();
            UserOwnsData.tileDiv.hide();
            UserOwnsData.dashboardDiv.show();
            UserOwnsData.dashboardContainer.hide();
            UserOwnsData.dashboardSpinner.hide();
            UserOwnsData.dashboardDisplayText.show();
            UserOwnsData.reportWrapper.hide();
            UserOwnsData.tileWrapper.hide();
            UserOwnsData.dashboardWrapper.show();

            // Repopulate select list for dashboard select event
            UserOwnsData.resetDashboardList();
            UserOwnsData.dashboardSelect.attr("disabled", "disabled");
        }

        // When radio button for tile is clicked
        else if ($("#tile").get(0).checked) {
            UserOwnsData.reportDiv.hide();
            UserOwnsData.dashboardDiv.show();
            UserOwnsData.tileDiv.show();
            UserOwnsData.tileContainer.hide();
            UserOwnsData.tileSpinner.hide();
            UserOwnsData.tileDisplayText.show();
            UserOwnsData.reportWrapper.hide();
            UserOwnsData.dashboardWrapper.hide();
            UserOwnsData.tileWrapper.show();

            // Repopulate select lists for tile select event
            UserOwnsData.resetDashboardList();
            UserOwnsData.resetTileList();
            UserOwnsData.dashboardSelect.attr("disabled", "disabled");
            UserOwnsData.tileSelect.attr("disabled", "disabled");
        }
    });

    // Workspace select event
    UserOwnsData.workspaceSelect.on("change", function () {
        let getSelectParams = {
            workspaceId: this.value
        };
        UserOwnsData.embedButton.attr("disabled", "disabled");

        // Populate select list
        if ($("#report").get(0).checked) {
            UserOwnsData.reportSelect.attr("disabled", "disabled");

            // Populate list of reports if report is checked
            UserOwnsData.resetReportList();
            UserOwnsData.getReports(getSelectParams);
        } else if ($("#dashboard").get(0).checked) {
            UserOwnsData.dashboardSelect.attr("disabled", "disabled");

            // Populate list of dashboards when dashboard radio is checked
            UserOwnsData.resetDashboardList();
            UserOwnsData.getDashboards(getSelectParams);
        } else {
            UserOwnsData.dashboardSelect.attr("disabled", "disabled");
            UserOwnsData.tileSelect.attr("disabled", "disabled");

            // Populate list of dashboards when tile radio is checked
            UserOwnsData.resetDashboardList();
            UserOwnsData.resetTileList();
            UserOwnsData.getDashboards(getSelectParams);
        }
    });

    // Report select event
    UserOwnsData.reportSelect.on("change", function () {
        UserOwnsData.embedButton.removeAttr("disabled");
    });

    // Dashboard select event
    UserOwnsData.dashboardSelect.on("change", function () {
        let getSelectParams = {
            accessToken: loggedInUser.accessToken,
            workspaceId: UserOwnsData.workspaceSelect.get(0).value
        };

        // Populate list of tiles after selecting the workspace from workspace list
        if ($("#tile").get(0).checked) {
            UserOwnsData.embedButton.attr("disabled", "disabled");
            UserOwnsData.tileSelect.attr("disabled", "disabled");
            UserOwnsData.resetTileList();
            getSelectParams.dashboardId = this.value;
            UserOwnsData.getTiles(getSelectParams);
        }

        // Enable embedButton when dashboard is selected
        else {
            UserOwnsData.embedButton.removeAttr("disabled");
        }
    });

    // Tile select event
    UserOwnsData.tileSelect.on("change", function () {
        UserOwnsData.embedButton.removeAttr("disabled");
    });

    // Embed content on button click
    UserOwnsData.embedButton.on("click", function () {
        let embedParam = {
            workspaceId: UserOwnsData.workspaceSelect.get(0).value
        };

        // Report radio button is checked
        if ($("#report").get(0).checked) {
            embedParam.reportId = UserOwnsData.reportSelect.get(0).value;
            UserOwnsData.reportDisplayText.hide();
            $(".report-wrapper").removeClass("transparent-bg");
            UserOwnsData.reportContainer.hide();
            UserOwnsData.reportSpinner.show();

            // Embed report
            UserOwnsData.embedReport(embedParam);
        }

        // Dashboard radio button is checked
        else if ($("#dashboard").get(0).checked) {
            embedParam.dashboardId = UserOwnsData.dashboardSelect.get(0).value;
            UserOwnsData.dashboardDisplayText.hide();
            UserOwnsData.dashboardContainer.hide();
            UserOwnsData.dashboardSpinner.show();

            // Embed dashboard
            UserOwnsData.embedDashboard(embedParam);
        }

        // Tile radio button is checked
        else if ($("#tile").get(0).checked) {
            embedParam.dashboardId = UserOwnsData.dashboardSelect.get(0).value;
            embedParam.tileId = UserOwnsData.tileSelect.get(0).value;
            UserOwnsData.tileDisplayText.hide();
            UserOwnsData.tileContainer.hide();
            UserOwnsData.tileSpinner.show();

            // Embed tile
            UserOwnsData.embedTile(embedParam);
        }
        UserOwnsData.embedButton.attr("disabled", "disabled");
    });
}