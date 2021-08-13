// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Embed Power BI report
UserOwnsData.embedReport = async function (embedParam) {

    // For setting type of token in embed config
    const models = window["powerbi-client"].models;
    const embedType = "report";

    let embedUrl;

    try {
        // Retrieves embed url for Power BI report
        embedUrl = await UserOwnsData.getEmbedUrl(embedParam, embedType);
    } catch (error) {
        UserOwnsData.showError(error);
    }

    const reportConfig = {
        type: embedType,
        tokenType: models.TokenType.Aad,
        accessToken: loggedInUser.accessToken,
        embedUrl: embedUrl,
        // Enable this setting to remove gray shoulders from embedded report
        // settings: {
        //     background: models.BackgroundType.Transparent
        // }
    };

    // Check if the embed url is for RDL report
    let isRDLReport = embedUrl.toLowerCase().indexOf("/rdlembed?") >= 0;
 
    // Check if reset is required
    let resetRequired = UserOwnsData.isPreviousReportRDL || isRDLReport;

    UserOwnsData.isPreviousReportRDL = isRDLReport;

    // Reset report container in case the current report or perviously embedded report is a RDL Report
    if (resetRequired) {
        powerbi.reset(UserOwnsData.reportContainer.get(0));
    }

    // Show report container as there is no loaded event for RDL reports
    if (isRDLReport) {
        $(".report-wrapper").addClass("transparent-bg");
        showEmbedContainer(UserOwnsData.reportSpinner, UserOwnsData.reportContainer);
    }

    // Embed Power BI report
    const report = powerbi.embed(UserOwnsData.reportContainer.get(0), reportConfig);

    // Clear any other loaded handler events
    report.off("loaded");

    // Triggers when a report schema is successfully loaded
    report.on("loaded", function () {
        console.log("Report load successful");
        $(".report-wrapper").addClass("transparent-bg");
        showEmbedContainer(UserOwnsData.reportSpinner, UserOwnsData.reportContainer);
    });

    // Clear any other rendered handler events
    report.off("rendered");

    // Triggers when a report is successfully embedded in UI
    report.on("rendered", function () {
        console.log("Report render successful");
    }); 

    // Clear any other error handler event
    report.off("error");

    // Below patch of code is for handling errors that occur during embedding
    report.on("error", function (event) {
        const errorMsg = event.detail;

        // Use errorMsg variable to log error in any destination of choice
        console.error(errorMsg);
        return;
    });
}

// Embed Power BI dashboard
UserOwnsData.embedDashboard = async function (embedParam) {

    // For setting type of token in embed config
    const models = window["powerbi-client"].models;
    const embedType = "dashboard";

    let embedUrl;

    try {
        // Retrieves embed url for Power BI dashboard
        embedUrl = await UserOwnsData.getEmbedUrl(embedParam, embedType);
    } catch (error) {
        UserOwnsData.showError(error);
    }

    const dashboardConfig = {
        type: embedType,
        tokenType: models.TokenType.Aad,
        accessToken: loggedInUser.accessToken,
        embedUrl: embedUrl,
    };

    // Embed Power BI dashboard
    const dashboard = powerbi.embed(UserOwnsData.dashboardContainer.get(0), dashboardConfig);

    // Clear any other loaded handler events
    dashboard.off("loaded");

    // Triggers when a dashboard schema is successfully loaded
    dashboard.on("loaded", function () {
        console.log("Dashboard load successful");
        showEmbedContainer(UserOwnsData.dashboardSpinner, UserOwnsData.dashboardContainer);
    });

    // Clear any other tileClicked handler events
    dashboard.off("tileClicked");

    // Handle tileClicked event
    dashboard.on("tileClicked", function (event) {
        console.log("Tile clicked");
    });

    // Clear any other error handler event
    dashboard.off("error");

    // Below patch of code is for handling errors that occur during embedding
    dashboard.on("error", function (event) {
        const errorMsg = event.detail;

        // Use errorMsg variable to log error in any destination of choice
        console.error(errorMsg);
        return;
    });
}

// Embed Power BI tile
UserOwnsData.embedTile = async function (embedParam) {

    // For setting type of token in embed config
    const models = window["powerbi-client"].models;
    const embedType = "tile";

    let embedUrl;

    try {
        // Retrieves embed url for Power BI tile
        embedUrl = await UserOwnsData.getEmbedUrl(embedParam, embedType);
    } catch (error) {
        UserOwnsData.showError(error);
    }

    const tileConfig = {
        type: embedType,
        tokenType: models.TokenType.Aad,
        accessToken: loggedInUser.accessToken,
        embedUrl: embedUrl,
        dashboardId: embedParam.dashboardId
    };

    // Embed Power BI tile
    const tile = powerbi.embed(UserOwnsData.tileContainer.get(0), tileConfig);

    // Clear any other tileLoaded handler events
    tile.off("tileLoaded");

    // Handle tileLoad event
    tile.on("tileLoaded", function (event) {
        console.log("Tile load successful");
        showEmbedContainer(UserOwnsData.tileSpinner, UserOwnsData.tileContainer);
    });

    // Clear any other tileClicked handler events
    tile.off("tileClicked");

    // Handle tileClicked event
    tile.on("tileClicked", function (event) {
        console.log("Tile clicked");
    });
}

UserOwnsData.isEmbedded = function (embedType) {
    const embedObjects = powerbi.embeds;
    if (embedObjects.length > 0) {
        for (let i = 0; i < embedObjects.length; i++) {
            if (embedObjects[i].embedtype === embedType) {
                return true;
            }
        }
    }
    return false;
}

// Show report, dashboard and tile container once it is loaded
function showEmbedContainer(componentSpinner, componentContainer) {
    componentSpinner.hide();

    // Show embed container
    componentContainer.css({ visibility: "visible" });

    // Remove height and width property from embed container
    componentContainer.css({ "height": "", "width": "" });
}
