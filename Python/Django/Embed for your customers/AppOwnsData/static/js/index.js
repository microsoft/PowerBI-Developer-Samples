$(function () {
    var reportContainer = $("#report-container").get(0);

    // Initialize iframe for embedding report
    powerbi.bootstrap(reportContainer, { type: "report" });

    var models = window["powerbi-client"].models;
    var reportLoadConfig = {
        type: "report",
        tokenType: models.TokenType.Embed,
    };

    $.ajax({
        type: "GET",
        url: "/get_embed_info/",
        dataType: "json",
        success: handleEmbedData,
        error: handleError
    });

    function handleEmbedData(data) {
        var embedData = JSON.parse(data);
        reportLoadConfig.accessToken = embedData.accessToken;
        reportLoadConfig.embedUrl = embedData.reportConfig[0].embedUrl;
        tokenExpiry = embedData.tokenExpiry;

        var report = powerbi.embed(reportContainer, reportLoadConfig);

        report.on("loaded", handleReportLoad);
        report.on("rendered", handleReportRender);
        report.off("error");
        report.on("error", handleError);
    }

    function handleReportLoad() {
        console.log("Report load successful");
    }

    function handleReportRender() {
        console.log("Report render successful");
    }

    function handleError(event) {
        var errorMsg = event.detail;
        console.error(errorMsg);
        return;
    }

    function displayError(err) {
        var errorContainer = $(".error-container");
        $(".embed-container").hide();
        errorContainer.show();

        var errMessageHtml = "<strong> Error Details: </strong> <br/>" + $.parseJSON(err.responseText)["errorMsg"];
        errMessageHtml = errMessageHtml.split("\n").join("<br/>")

        errorContainer.html(errMessageHtml);
    }
});
