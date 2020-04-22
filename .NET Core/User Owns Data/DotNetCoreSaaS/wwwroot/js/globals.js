// To cache logged in user's info
var loggedInUser = {
    name: undefined,
    accessToken: undefined
};

// Cache DOM objects
var workspaceSelect = $("#workspace-select");
var workspaceDefaultOption = $("#workspace-default-option").get(0);
var reportDiv = $("#report-div");
var dashboardDiv = $("#dashboard-div");
var tileDiv = $("#tile-div");
var reportSelect = $("#report-select");
var dashboardSelect = $("#dashboard-select");
var reportWrapper = $(".report-wrapper");
var dashboardWrapper = $(".dashboard-wrapper");
var tileWrapper = $(".tile-wrapper");
var reportDisplayText = $(".report-display-text");
var dashboardDisplayText = $(".dashboard-display-text");
var tileDisplayText = $(".tile-display-text");
var embedButton = $(".embed-button");
var tileSelect = $("#tile-select");
var reportContainer = $("#report-container");
var dashboardContainer = $("#dashboard-container");
var tileContainer = $("#tile-container");
