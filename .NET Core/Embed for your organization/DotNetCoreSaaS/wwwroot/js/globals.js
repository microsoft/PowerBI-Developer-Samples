// To cache logged in user's info
const loggedInUser = {
    name: undefined
};

// Cache DOM objects
const workspaceSelect = $("#workspace-select");
const workspaceDefaultOption = $("#workspace-default-option").get(0);
const reportDiv = $("#report-div");
const dashboardDiv = $("#dashboard-div");
const tileDiv = $("#tile-div");
const reportSelect = $("#report-select");
const dashboardSelect = $("#dashboard-select");
const reportWrapper = $(".report-wrapper");
const dashboardWrapper = $(".dashboard-wrapper");
const tileWrapper = $(".tile-wrapper");
const reportDisplayText = $(".report-display-text");
const dashboardDisplayText = $(".dashboard-display-text");
const tileDisplayText = $(".tile-display-text");
const embedButton = $(".embed-button");
const tileSelect = $("#tile-select");
const reportContainer = $("#report-container");
const dashboardContainer = $("#dashboard-container");
const tileContainer = $("#tile-container");
