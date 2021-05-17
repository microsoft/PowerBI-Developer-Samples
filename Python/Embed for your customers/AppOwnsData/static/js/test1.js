// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

$(function () {
    var reportContainer = $("#report-container").get(0);

    // Initialize iframe for embedding report
    powerbi.bootstrap(reportContainer, { type: "report" });

    var models = window["powerbi-client"].models;
    var reportLoadConfig = {
        type: "report",
        tokenType: models.TokenType.Embed,

        // Enable this setting to remove gray shoulders from embedded report

        // EH: hiding report footer page tabs/navigation
        // ref: https://community.powerbi.com/t5/Developer/How-to-Hide-Power-BI-iFrame-Embedded-Report-Tabs/m-p/121541
        settings: {
            //background: models.BackgroundType.Transparent
            filterPaneEnabled: false,
            navContentPaneEnabled: false
        }
        // EH: hiding report footer page tabs/navigation
    };

    $.ajax({
        type: "GET",
        url: "/getembedinfo",
        dataType: "json",
        success: function (data) {
            embedData = $.parseJSON(JSON.stringify(data));
            reportLoadConfig.accessToken = embedData.accessToken;

            // You can embed different reports as per your need
            reportLoadConfig.embedUrl = embedData.reportConfig[0].embedUrl;

            // Use the token expiry to regenerate Embed token for seamless end user experience
            // Refer https://aka.ms/RefreshEmbedToken
            tokenExpiry = embedData.tokenExpiry;

            // Embed Power BI report when Access token and Embed URL are available
            var report = powerbi.embed(reportContainer, reportLoadConfig);

            // Triggers when a report schema is successfully loaded
            report.on("loaded", function () {
                console.log("Report load successful");

                // EH: set page to 2nd page (LGA)
                report.getPages()
                .then(pages => {
                    console.log("Listing all page objects");
                    //console.log(pages); // <--- should contain ALL pages
                    /**
                     * Page object, key properties:
                     * - displayName : the name we gave the page in powerbi
                     * - name        : the page ID, e.g. ReportSection!@$%#$^
                     * - visibility  : is this visible to end users probably
                     */
                    var cpage = pages[1];
                    cpage.setActive();
                });
                // EH: set page to 2nd page (LGA)
            });

            // Triggers when a report is successfully embedded in UI
            report.on("rendered", function () {
                console.log("Report render successful");
            });

            // Clear any other error handler event
            report.off("error");

            // Below patch of code is for handling errors that occur during embedding
            report.on("error", function (event) {
                var errorMsg = event.detail;

                // Use errorMsg variable to log error in any destination of choice
                console.error(errorMsg);
                return;
            });
        },
        error: function (err) {

            // Show error container
            var errorContainer = $(".error-container");
            $(".embed-container").hide();
            errorContainer.show();

            // Format error message
            var errMessageHtml = "<strong> Error Details: </strong> <br/>" + $.parseJSON(err.responseText)["errorMsg"];
            errMessageHtml = errMessageHtml.split("\n").join("<br/>")

            // Show error message on UI
            errorContainer.html(errMessageHtml);
        }
    });
});