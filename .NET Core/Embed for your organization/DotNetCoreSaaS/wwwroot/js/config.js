function validateConfig() {
    var message = "";
    if (!authConfig.authority) {
        message += "Authority Uri is not set in authConfig.js\n";
    }
    if (!authConfig.clientId) {
        message += "Client Id is not set in authConfig.js\n";
    }
    if (!authConfig.redirectUri) {
        message += "Redirect Uri is not set in authConfig.js\n";
    }
    if (!Array.isArray(authConfig.scopes) || !authConfig.scopes.length) {
        message += "Scopes are not set in authConfig.js";
    }
    if (message) {
        var err = { responseText: message };

        // Hiding overlay to show error
        $(".overlay").get(0).style.display = "none";
        showError(err);
    }
}