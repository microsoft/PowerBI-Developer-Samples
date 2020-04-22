$(function () {

    // Check authorization configuration settings
    validateConfig();

    // Initialize event handlers
    initializeEventHandlers();

    // Hide dashboard div with jQuery
    dashboardDiv.hide();
    dashboardDiv.get(0).hidden = false;

    // Hide tile div with jQuery
    tileDiv.hide();
    tileDiv.get(0).hidden = false;

    // Hide dashboard wrapper with jQuery
    dashboardWrapper.hide();
    dashboardWrapper.get(0).hidden = false;

    // Hide tile wrapper with jQuery
    tileWrapper.hide();
    tileWrapper.get(0).hidden = false;

    // Hide report container with jQuery
    reportContainer.hide();
    reportContainer.get(0).hidden = false;

    // Hide dashboard container with jQuery
    dashboardContainer.hide();
    dashboardContainer.get(0).hidden = false;

    // Hide tile container with jQuery
    tileContainer.hide();
    tileContainer.get(0).hidden = false;

    // Populate user's information
    getUserInfo();
});