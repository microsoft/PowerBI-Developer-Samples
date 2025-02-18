// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as config from "./Config";

const msalInstanceProvider = new PublicClientApplication(generateMsalConfig());

ReactDOM.render(
<MsalProvider instance={msalInstanceProvider}>
    <App/>
</MsalProvider>,
document.getElementById('root'));

// Refer https://docs.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-react#configure-your-javascript-spa
function generateMsalConfig() {
    const msalConfig = {
        auth: {
            clientId: config.clientId,
            authority: `${config.authorityUrl}${config.tenantId}`,
            redirectUri: "http://localhost:3000",
        },
        cache: {
            cacheLocation: "sessionStorage", // This configures where your cache will be stored
            storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
        }
    };

    return msalConfig;
}