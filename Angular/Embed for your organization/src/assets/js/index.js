// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

$(function () {

    // Initialize event handlers
    UserOwnsData.initializeEventHandlers();

    // Hide dashboard div with jQuery
    UserOwnsData.dashboardDiv.hide();
    UserOwnsData.dashboardDiv.get(0).hidden = false;

    // Hide tile div with jQuery
    UserOwnsData.tileDiv.hide();
    UserOwnsData.tileDiv.get(0).hidden = false;

    // Hide dashboard wrapper with jQuery
    UserOwnsData.dashboardWrapper.hide();
    UserOwnsData.dashboardWrapper.get(0).hidden = false;

    // Hide tile wrapper with jQuery
    UserOwnsData.tileWrapper.hide();
    UserOwnsData.tileWrapper.get(0).hidden = false;

    // Hide report container
    UserOwnsData.reportContainer.css({ height: 0 + 'px', width: 0 + 'px' });

    // Hide dashboard container
    UserOwnsData.dashboardContainer.css({ height: 0 + 'px', width: 0 + 'px' });

    // Hide tile container
    UserOwnsData.tileContainer.css({ height: 0 + 'px', width: 0 + 'px' });

    // Hide report spinner with jQuery
    UserOwnsData.reportSpinner.hide();

    // Hide dashboard spinner with jQuery
    UserOwnsData.dashboardSpinner.hide();

    // Hide tile spinner with jQuery
    UserOwnsData.tileSpinner.hide();

    // Apply bootstrap to report, dashboard, and tile containers
    powerbi.bootstrap(UserOwnsData.reportContainer.get(0), { type: "report", hostname: UserOwnsData.powerBiHostname });
    powerbi.bootstrap(UserOwnsData.dashboardContainer.get(0), { type: "dashboard", hostname: UserOwnsData.powerBiHostname });
    powerbi.bootstrap(UserOwnsData.tileContainer.get(0), { type: "tile", hostname: UserOwnsData.powerBiHostname });

    UserOwnsData.getWorkspaces();
});