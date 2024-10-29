// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

$(function() {

    // Disable workspace select list if no workspace found
    if (globals.workspaceSelect.length == 0) {
        globals.workspaceSelect.addAttr("disabled");
    }

    // Power BI REST API call to refresh User Permissions in Power BI
    // Refreshes user permissions and makes sure the user permissions are fully updated
    // https://docs.microsoft.com/rest/api/power-bi/users/refreshuserpermissions
    tryRefreshUserPermissions();

    // Initialize event handlers
    initializeEventHandlers();

    // Hide dashboard div with jQuery
    globals.dashboardDiv.hide();
    globals.dashboardDiv.get(0).hidden = false;

    // Hide tile div with jQuery
    globals.tileDiv.hide();
    globals.tileDiv.get(0).hidden = false;

    // Hide dashboard wrapper with jQuery
    globals.dashboardWrapper.hide();
    globals.dashboardWrapper.get(0).hidden = false;

    // Hide tile wrapper with jQuery
    globals.tileWrapper.hide();
    globals.tileWrapper.get(0).hidden = false;

    // Hide report container
    globals.reportContainer.css({ height: 0 + 'px', width: 0 + 'px' });

    // Hide dashboard container
    globals.dashboardContainer.css({ height: 0 + 'px', width: 0 + 'px' });

    // Hide tile container
    globals.tileContainer.css({ height: 0 + 'px', width: 0 + 'px' });

    // Hide report spinner with jQuery
    globals.reportSpinner.hide();

    // Hide dashboard spinner with jQuery
    globals.dashboardSpinner.hide();

    // Hide tile spinner with jQuery
    globals.tileSpinner.hide();

    // Apply bootstrap to report, dashboard, and tile containers
    powerbi.bootstrap(globals.reportContainer.get(0), { type: "report", hostname: globals.powerBiHostname });
    powerbi.bootstrap(globals.dashboardContainer.get(0), { type: "dashboard", hostname: globals.powerBiHostname });
    powerbi.bootstrap(globals.tileContainer.get(0), { type: "tile", hostname: globals.powerBiHostname });

    globals.getWorkspaces();
});