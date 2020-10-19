// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Embed Power BI report
DotNetCoreSaaS.embedReport = function (embedParam) {

    // For setting type of token in embed config
    const models = window["powerbi-client"].models;
    const embedType = "report";

    // If report is not embedded previously then call bootstrap
    if (!DotNetCoreSaaS.isEmbedded(embedType)) {
        powerbi.bootstrap(reportContainer.get(0), { type: embedType });
    }

    $.ajax({
        type: "GET",
        url: "/embedinfo/reportembedurl",
        data: embedParam,
        contentType: "application/json; charset=utf-8",
        success: function (embedConfig) {
            const reportConfig = {
                type: embedType,
                tokenType: models.TokenType.Aad,
                accessToken: embedConfig.accessToken,
                embedUrl: embedConfig.embedUrl,
                // Enable this setting to remove gray shoulders from embedded report
                // settings: {
                //     background: models.BackgroundType.Transparent
                // }
            };

            // Embed Power BI report
            const report = powerbi.embed(reportContainer.get(0), reportConfig);

            // Clear any other loaded handler events
            report.off("loaded");

            // Triggers when a report schema is successfully loaded
            report.on("loaded", function () {
                reportDisplayText.hide();
                $(".report-wrapper").addClass("transparent-bg");
                reportContainer.show();
                console.log("Report load successful");
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
        },
        error: function (err) {
            DotNetCoreSaaS.showError(err);
        }
    });
}

// Embed Power BI dashboard
DotNetCoreSaaS.embedDashboard = function (embedParam) {

    // For setting type of token in embed config
    const models = window["powerbi-client"].models;
    const embedType = "dashboard";

    $.ajax({
        type: "GET",
        url: "/embedinfo/dashboardembedurl",
        data: embedParam,
        contentType: "application/json; charset=utf-8",
        success: function (embedConfig) {
            const dashboardConfig = {
                type: embedType,
                tokenType: models.TokenType.Aad,
                accessToken: embedConfig.accessToken,
                embedUrl: embedConfig.embedUrl,
            };

            // Embed Power BI dashboard
            const dashboard = powerbi.embed(dashboardContainer.get(0), dashboardConfig);

            // Clear any other loaded handler events
            dashboard.off("loaded");

            // Triggers when a dashboard schema is successfully loaded
            dashboard.on("loaded", function () {
                dashboardDisplayText.hide();
                dashboardContainer.show();
                console.log("Dashboard load successful");
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
        },
        error: function (err) {
            DotNetCoreSaaS.showError(err);
        }
    });
}

// Embed Power BI tile
DotNetCoreSaaS.embedTile = function (embedParam) {

    // For setting type of token in embed config
    const models = window["powerbi-client"].models;
    const embedType = "tile";

    $.ajax({
        type: "GET",
        url: "/embedinfo/tileembedurl",
        data: embedParam,
        contentType: "application/json; charset=utf-8",
        success: function (embedConfig) {
            const tileConfig = {
                type: embedType,
                tokenType: models.TokenType.Aad,
                accessToken: embedConfig.accessToken,
                embedUrl: embedConfig.embedUrl,
                dashboardId: embedParam.dashboardId
            };

            // Embed Power BI tile
            const tile = powerbi.embed(tileContainer.get(0), tileConfig);

            // Clear any other tileLoaded handler events
            tile.off("tileLoaded");

            // Handle tileLoad event
            tile.on("tileLoaded", function (event) {
                tileDisplayText.hide();
                tileContainer.show();
                console.log("Tile load successful");
            });

            // Clear any other tileClicked handler events
            tile.off("tileClicked");

            // Handle tileClicked event
            tile.on("tileClicked", function (event) {
                console.log("Tile clicked");
            });
        },
        error: function (err) {
            DotNetCoreSaaS.showError(err);
        }
    });
}

DotNetCoreSaaS.isEmbedded = function (embedType) {
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