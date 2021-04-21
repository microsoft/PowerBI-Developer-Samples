// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Embed Power BI report
function embedReport(embedParam) {

    // For setting type of token in embed config
    let models = window["powerbi-client"].models;
    let embedType = "report";

    // If report is not embedded previously then call bootstrap
    if (!isEmbedded(embedType)) {
        powerbi.bootstrap(globals.reportContainer.get(0), { type: embedType });
    }

    $.ajax({
        type: "POST",
        url: "/embedinfo/reportembedconfig",
        data: JSON.stringify(embedParam),
        contentType: "application/json; charset=utf-8",
        success: function(embedConfig) {
            let reportConfig = {
                type: embedType,
                tokenType: models.TokenType.Aad,
                accessToken: embedConfig.AccessToken,
                embedUrl: embedConfig.EmbedUrl,

                // Enable this setting to remove gray shoulders from embedded report
                // settings: {
                //	 background: models.BackgroundType.Transparent
                // }
            };

            // Embed Power BI report
            let report = powerbi.embed(globals.reportContainer.get(0), reportConfig);

            // Clear any other loaded handler events
            report.off("loaded");

            // Triggers when a report schema is successfully loaded
            report.on("loaded", function() {
                globals.reportSpinner.hide();
                $(".report-wrapper").addClass("transparent-bg");
                globals.reportContainer.show();
                console.log("Report load successful");
            });

            // Clear any other rendered handler events
            report.off("rendered");

            // Triggers when a report is successfully embedded in UI
            report.on("rendered", function() {
                console.log("Report render successful");
            });

            // Clear any other error handler event
            report.off("error");

            // Below patch of code is for handling errors that occur during embedding
            report.on("error", function(event) {
                let errorMsg = event.detail;

                // Use errorMsg variable to log error in any destination of choice
                console.error(errorMsg);
                return;
            });
        },
        error: function(err) {
            showError(err);
        }
    });
}

// Embed Power BI dashboard
function embedDashboard(embedParam) {

    // For setting type of token in embed config
    let models = window["powerbi-client"].models;
    let embedType = "dashboard";

    $.ajax({
        type: "POST",
        url: "/embedinfo/dashboardembedconfig",
        data: JSON.stringify(embedParam),
        contentType: "application/json; charset=utf-8",
        success: function(embedConfig) {
            let dashboardConfig = {
                type: embedType,
                tokenType: models.TokenType.Aad,
                accessToken: embedConfig.AccessToken,
                embedUrl: embedConfig.EmbedUrl
            };

            // Embed Power BI dashboard
            let dashboard = powerbi.embed(globals.dashboardContainer.get(0), dashboardConfig);

            // Clear any other loaded handler events
            dashboard.off("loaded");

            // Triggers when a dashboard schema is successfully loaded
            dashboard.on("loaded", function() {
                globals.dashboardSpinner.hide();
                globals.dashboardContainer.show();
                console.log("Dashboard load successful");
            });

            // Clear any other tileClicked handler events
            dashboard.off("tileClicked");

            // Handle tileClicked event
            dashboard.on("tileClicked", function(event) {
                console.log("Tile clicked");
            });

            // Clear any other error handler event
            dashboard.off("error");

            // Below patch of code is for handling errors that occur during embedding
            dashboard.on("error", function(event) {
                let errorMsg = event.detail;

                // Use errorMsg variable to log error in any destination of choice
                console.error(errorMsg);
                return;
            });
        },
        error: function(err) {
            showError(err);
        }
    });
}

// Embed Power BI tile
function embedTile(embedParam) {

    // For setting type of token in embed config
    let models = window["powerbi-client"].models;
    let embedType = "tile";

    $.ajax({
        type: "POST",
        url: "/embedinfo/tileembedconfig",
        data: JSON.stringify(embedParam),
        contentType: "application/json; charset=utf-8",
        success: function(embedConfig) {
            let tileConfig = {
                type: embedType,
                tokenType: models.TokenType.Aad,
                accessToken: embedConfig.AccessToken,
                embedUrl: embedConfig.EmbedUrl,
                dashboardId: embedParam.dashboardId
            };

            // Embed Power BI tile
            let tile = powerbi.embed(globals.tileContainer.get(0), tileConfig);

            // Clear any other tileLoaded handler events
            tile.off("tileLoaded");

            // Handle tileLoad event
            tile.on("tileLoaded", function(event) {
                globals.tileSpinner.hide();
                globals.tileContainer.show();
                console.log("Tile load successful");
            });

            // Clear any other tileClicked handler events
            tile.off("tileClicked");

            // Handle tileClicked event
            tile.on("tileClicked", function(event) {
                console.log("Tile clicked");
            });
        },
        error: function(err) {
            showError(err);
        }
    });
}

function isEmbedded(embedType) {
    return powerbi.embeds.filter(e => e.embedtype === embedType).length > 0;
}