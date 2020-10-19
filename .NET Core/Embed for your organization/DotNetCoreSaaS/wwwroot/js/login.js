// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

DotNetCoreSaaS.showUsername = function (userName) {
    const userInfo = $(".user-info").get(0);

    // Initialize Welcome text
    const txt = document.createTextNode("Welcome ");
    const name = document.createTextNode(`${userName}!`);

    // Underline the user's name
    const ulName = document.createElement("u");
    ulName.appendChild(name);

    // Make the user's name bold
    const boldName = document.createElement("strong");
    boldName.appendChild(ulName);

    // Set user's name on web page
    userInfo.appendChild(txt);
    userInfo.appendChild(boldName);
}
