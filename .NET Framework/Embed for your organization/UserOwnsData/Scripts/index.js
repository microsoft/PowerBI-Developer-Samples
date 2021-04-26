// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

$(function() {

    // Disable workspace select list if no workspace found
    if (globals.workspaceSelect.length == 0) {
        globals.workspaceSelect.addAttr("disabled");
    }

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

    // Hide report container with jQuery
    globals.reportContainer.hide();
    globals.reportContainer.get(0).hidden = false;

    // Hide dashboard container with jQuery
    globals.dashboardContainer.hide();
    globals.dashboardContainer.get(0).hidden = false;

    // Hide tile container with jQuery
    globals.tileContainer.hide();
    globals.tileContainer.get(0).hidden = false;

    // Hide report spinner with jQuery
    globals.reportSpinner.hide();

    // Hide dashboard spinner with jQuery
    globals.dashboardSpinner.hide();

    // Hide tile spinner with jQuery
    globals.tileSpinner.hide();

    globals.getWorkspaces();
});