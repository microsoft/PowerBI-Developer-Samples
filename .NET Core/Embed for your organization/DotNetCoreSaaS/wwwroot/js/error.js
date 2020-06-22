// Show error to the user
function showError(err) {
    var errorContainer = $("#error-container");
    reportWrapper.hide();
    dashboardWrapper.hide();
    tileWrapper.hide();
    $(".config-container").hide();
    $("header").hide();

    // Show error container
    errorContainer.show();

    // Format error message
    var errHeader = document.createTextNode("Error Details:");
    var strong = document.createElement("strong");
    strong.appendChild(errHeader);

    // Create paragraph element to store error header and error message
    var errorMessage = document.createElement("p");
    errorMessage.appendChild(strong);

    // Break error message around \n and appends break element at the corresponding index
    var arr = err.responseText.split("\n");
    for (var i = 0; i < arr.length; i++) {
        var br = document.createElement("br");

        // Create node element to store individual line from the error message
        // along with the break element
        var node = document.createTextNode(arr[i]);
        errorMessage.appendChild(br);
        errorMessage.appendChild(node);
    }

    // Show error message on UI
    errorContainer.get(0).appendChild(errorMessage);
}