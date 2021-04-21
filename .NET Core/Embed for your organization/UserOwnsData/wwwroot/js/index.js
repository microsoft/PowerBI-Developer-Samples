// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

$(function () {

    // Initialize event handlers
    UserOwnsData.initializeEventHandlers();

    // Show username of signed in user
    UserOwnsData.showUsername(signedInUsername);

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

    // Hide report container with jQuery
    UserOwnsData.reportContainer.hide();
    UserOwnsData.reportContainer.get(0).hidden = false;

    // Hide dashboard container with jQuery
    UserOwnsData.dashboardContainer.hide();
    UserOwnsData.dashboardContainer.get(0).hidden = false;

    // Hide tile container with jQuery
    UserOwnsData.tileContainer.hide();
    UserOwnsData.tileContainer.get(0).hidden = false;

    // Hide report spinner with jQuery
    UserOwnsData.reportSpinner.hide();

    // Hide dashboard spinner with jQuery
    UserOwnsData.dashboardSpinner.hide();

    // Hide tile spinner with jQuery
    UserOwnsData.tileSpinner.hide();

    UserOwnsData.getWorkspaces();
});