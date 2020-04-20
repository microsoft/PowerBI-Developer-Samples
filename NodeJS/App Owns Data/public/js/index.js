let models = window["powerbi-client"].models;
let reportContainer = $("#report-container").get(0);

// Initialize iframe for embedding report
powerbi.bootstrap(reportContainer, { type: "report" });

// AJAX request to get the report details from the API and pass it to the UI
$.ajax({
    type: "GET",
    url: "/getEmbedToken",
    dataType: "json",
    success: function(embedData) {

        // Create a config object with type of the object, Embed details and Token Type
        let reportLoadConfig = {
            type: "report",
            tokenType: models.TokenType.Embed,
            accessToken: embedData.accessToken,
            embedUrl: embedData.embedUrl
        };

        // Use the token expiry to regenerate Embed token for seamless end user experience
        // Refer https://aka.ms/RefreshEmbedToken
        tokenExpiry = embedData.expiry;

        // Embed Power BI report when Access token and Embed URL are available
        let report = powerbi.embed(reportContainer, reportLoadConfig);

        // Clear any other loaded handler events
        report.off("loaded");

        // Triggers when a report schema is successfully loaded
        report.on("loaded", function() {
            console.log("Report load successful");
        });

        // Clear any other rendered handler events
        report.off("rendered");

        // Triggers when a report is successfully embedded in UI
        report.on("rendered", function() {
            console.log("Report render successful");
        });

        // Clear any other error handler events
        report.off("error");

        // Handle embed errors
        report.on("error", function(event) {
            let errorMsg = event.detail;
            console.error(errorMsg);
            return;
        });
    },

    error: function(err) {

        // Show error container
        let errorContainer = $(".error-container");
        $(".embed-container").hide();
        errorContainer.show();

        // Get the error message from err object
        let errMsg = JSON.parse(err.responseText)['error'];

        // Split the message with \r\n delimiter to get the errors from the error message
        let errorLines = errMsg.split("\r\n");

        // Create error header
        let errHeader = document.createElement("p");
        let strong = document.createElement("strong");
        let node = document.createTextNode("Error Details:");

        // Get the error container
        let errContainer = errorContainer.get(0);

        // Add the error header in the container
        strong.appendChild(node);
        errHeader.appendChild(strong);
        errContainer.appendChild(errHeader);

        // Create <p> as per the length of the array and append them to the container
        errorLines.forEach(element => {
            let errorContent = document.createElement("p");
            let node = document.createTextNode(element);
            errorContent.appendChild(node);
            errContainer.appendChild(errorContent);
        });
    }
});