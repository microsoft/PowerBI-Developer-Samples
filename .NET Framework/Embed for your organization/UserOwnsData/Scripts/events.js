// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

function initializeEventHandlers() {

    // Radio button handle event
    $("input[type=radio]").on("click", function() {
        globals.workspaceDefaultOption.selected = "true";

        // Hide report container
        globals.reportContainer.css({ visibility: "hidden" });
        globals.reportContainer.css({ height: 0 + 'px', width: 0 + 'px' });

        // Hide dashboard container
        globals.dashboardContainer.css({ visibility: "hidden" });
        globals.dashboardContainer.css({ height: 0 + 'px', width: 0 + 'px' });

        // Hide tile container
        globals.tileContainer.css({ visibility: "hidden" });   
        globals.tileContainer.css({ height: 0 + 'px', width: 0 + 'px' });        

        // When report radio button is clicked
        if ($("#report").get(0).checked) {
            globals.dashboardDiv.hide();
            globals.tileDiv.hide();
            globals.reportDiv.show();
            globals.reportSpinner.hide();
            globals.reportDisplayText.show();
            globals.dashboardWrapper.hide();
            globals.tileWrapper.hide();
            $(".report-wrapper").removeClass("transparent-bg");
            $(".report-wrapper").addClass("colored-bg");
            globals.reportWrapper.show();

            // Repopulate select list for report select event
            resetReportList();
            globals.reportSelect.attr("disabled", "disabled");
        }

        // When dashboard radio button is clicked
        else if ($("#dashboard").get(0).checked) {
            globals.reportDiv.hide();
            globals.tileDiv.hide();
            globals.dashboardDiv.show();
            globals.dashboardSpinner.hide();
            globals.dashboardDisplayText.show();
            globals.reportWrapper.hide();
            globals.tileWrapper.hide();
            globals.dashboardWrapper.show();

            // Repopulate select list for dashboard select event
            resetDashboardList();
            globals.dashboardSelect.attr("disabled", "disabled");
        }

        // When radio button for tile is clicked
        else if ($("#tile").get(0).checked) {
            globals.reportDiv.hide();
            globals.dashboardDiv.show();
            globals.tileDiv.show();
            globals.tileSpinner.hide();
            globals.tileDisplayText.show();
            globals.reportWrapper.hide();
            globals.dashboardWrapper.hide();
            globals.tileWrapper.show();

            // Repopulate select lists for tile select event
            resetDashboardList();
            resetTileList();
            globals.dashboardSelect.attr("disabled", "disabled");
            globals.tileSelect.attr("disabled", "disabled");
        }
    });

    // Workspace select event
    globals.workspaceSelect.on("change", function() {
        let getSelectParams = {
            workspaceId: this.value
        };
        globals.embedButton.attr("disabled", "disabled");

        // Populate select list
        if ($("#report").get(0).checked) {
            globals.reportSelect.attr("disabled", "disabled");

            // Populate list of reports if report is checked
            resetReportList();
            getReports(getSelectParams);
        } else if ($("#dashboard").get(0).checked) {
            globals.dashboardSelect.attr("disabled", "disabled");

            // Populate list of dashboards when dashboard radio is checked
            resetDashboardList();
            getDashboards(getSelectParams);
        } else {
            globals.dashboardSelect.attr("disabled", "disabled");
            globals.tileSelect.attr("disabled", "disabled");

            // Populate list of dashboards when tile radio is checked
            resetDashboardList();
            resetTileList();
            getDashboards(getSelectParams);
        }
    });

    // Report select event
    globals.reportSelect.on("change", function() {
        globals.embedButton.removeAttr("disabled");
    });

    // Dashboard select event
    globals.dashboardSelect.on("change", function() {
        let getSelectParams = {
            workspaceId: globals.workspaceSelect.get(0).value
        };

        // Populate list of tiles after selecting the workspace from workspace list
        if ($("#tile").get(0).checked) {
            globals.embedButton.attr("disabled", "disabled");
            globals.tileSelect.attr("disabled", "disabled");
            resetTileList();
            getSelectParams.dashboardId = this.value;
            getTiles(getSelectParams);
        }

        // Enable globals.embedButton when dashboard is selected
        else {
            globals.embedButton.removeAttr("disabled");
        }
    });

    // Tile select event
    globals.tileSelect.on("change", function() {
        globals.embedButton.removeAttr("disabled");
    });

    // Embed content on button click
    globals.embedButton.on("click", function() {
        let embedParam = {
            workspaceId: globals.workspaceSelect.get(0).value
        };

        // Report radio button is checked
        if ($("#report").get(0).checked) {
            embedParam.reportId = globals.reportSelect.get(0).value;
            globals.reportDisplayText.hide();
            $(".report-wrapper").removeClass("transparent-bg");
            globals.reportSpinner.show();

            // Embed report
            embedReport(embedParam);
        }

        // Dashboard radio button is checked
        else if ($("#dashboard").get(0).checked) {
            embedParam.dashboardId = globals.dashboardSelect.get(0).value;
            globals.dashboardDisplayText.hide();
            globals.dashboardSpinner.show();

            // Embed dashboard
            embedDashboard(embedParam);
        }

        // Tile radio button is checked
        else if ($("#tile").get(0).checked) {
            embedParam.dashboardId = globals.dashboardSelect.get(0).value;
            embedParam.tileId = globals.tileSelect.get(0).value;
            globals.tileDisplayText.hide();
            globals.tileSpinner.show();

            // Embed tile
            embedTile(embedParam);
        }
        globals.embedButton.attr("disabled", "disabled");
    });
}