// Initialize configuration for sign-in
const appConfig = {
    auth: {
        authority: authConfig.authority,
        clientId: authConfig.clientId,
        redirectUri: authConfig.redirectUri
    }
};

const userAgentApplication = new Msal.UserAgentApplication(appConfig);
const request = {
    scopes: authConfig.scopes
};

// Register Callbacks for Redirect flow
userAgentApplication.handleRedirectCallback(authRedirectCallBack);
function authRedirectCallBack(error, response) {

    // Handle error redirect callback
    if (error) {
        console.error("Redirect error: " + error)
    } else {
        if (response.tokenType === "id_token") {
            getUserInfo();
        } else if (response.tokenType === "access_token") {
            initializeEmbed(response);
        } else {
            console.error("Token type is: " + response.tokenType);
        }
    }
}
function signIn() {

    // Redirect user to the sign-in page
    userAgentApplication.loginRedirect(request);
}

function initializeEmbed(tokenResponse) {
    if (tokenResponse) {
        loggedInUser.name = tokenResponse.account.name;
        loggedInUser.accessToken = tokenResponse.accessToken;

        // Hiding overlay after user signs-in
        $(".overlay").get(0).style.display = "none";

        var userInfo = $(".user-info").get(0);

        // Initialize Welcome text
        var txt = document.createTextNode("Welcome ");
        var name = document.createTextNode(loggedInUser.name + "!");

        // Underline the user's name
        var ulName = document.createElement("u");
        ulName.appendChild(name);

        // Make the user's name bold
        var boldName = document.createElement("strong");
        boldName.appendChild(ulName);

        // Set user's name on web page
        userInfo.appendChild(txt);
        userInfo.appendChild(boldName);

        // Populate workspace select list
        var getSelectParams = { accessToken: loggedInUser.accessToken };
        getWorkspaces(getSelectParams);
    }
}

function getUserInfo() {

    // If user is logged-in or cached
    if (userAgentApplication.getAccount()) {
        // Get Access token from cache
        return userAgentApplication.acquireTokenSilent(request).then(function (tokenResponse) {
            initializeEmbed(tokenResponse);
        }).catch(function (error) {

            // Use interaction when silent call fails
            return userAgentApplication.acquireTokenRedirect(request);
        });
    }
}