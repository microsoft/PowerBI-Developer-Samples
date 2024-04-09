// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Show error to the user
function showError(err) {
    let errorContainer = $("#error-container");
    globals.reportWrapper.hide();
    globals.dashboardWrapper.hide();
    globals.tileWrapper.hide();
    $(".config-container").hide();
    $("header").hide();

    // Show error container
    errorContainer.show();

    // Format error message
    let errHeader = document.createTextNode("Error Details:");
    let strong = document.createElement("strong");
    strong.appendChild(errHeader);

    // Create paragraph element to store error header and error message
    let errorMessage = document.createElement("p");
    errorMessage.appendChild(strong);

    // Break error message around \n and appends break element at the corresponding index
    let arr = err.responseText.split("\n");
    for (let i = 0; i < arr.length; i++) {
        let br = document.createElement("br");

        // Create node element to store individual line from the error message
        // along with the break element
        let node = document.createTextNode(arr[i]);
        errorMessage.appendChild(br);
        errorMessage.appendChild(node);
    }

    // Show error message on UI
    errorContainer.get(0).appendChild(errorMessage);
}