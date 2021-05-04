// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

$(function () {
    globalState = {
        datasources: []
    };

    // Create global list for storing endpoints
    const Endpoints = {
        GetDatasources: "/encryptcredential/getdatasourcesingroup",
        UpdateDatasource: "/encryptcredential/updatedatasource",
        AddDatasource: "/encryptcredential/adddatasource",
        Encrypt: "/encryptcredential/encrypt"
    };

    // Freezing the contents for endpoint objects
    Object.freeze(Endpoints);

    // Cache constants
    const ENABLED = "btn-primary";
    const DISABLED = "btn-secondary";
    const ACTIVE_TEXT = "active-text"
    const INACTIVE_TEXT = "inactive-text";

    // Cache DOM Objects
    const updateDatasourceContainer = $(".update-datasource-container");
    const addDatasourceContainer = $(".add-datasource-container");
    const encryptCredentialsContainer = $(".encrypt-credentials-container");
    const gatewayContainer = $(".gateway-container");
    const credentialKey = $("#credential-key");
    const credentialWindows = $("#credential-windows");
    const credentialOAuth2 = $("#credential-oauth2");
    const credentialBasic = $("#credential-basic");
    const functionality = $("#functionality-select");
    const getDatasourceButton = $("#get-datasources");
    const updateCredButton = $("#update-credentials");
    const addCredButton = $("#add-datasource");
    const encryptButton = $("#encrypt-button");
    const groupId = $("#group-id");
    const datasetId = $("#dataset-id");
    const datasourceDepsElements = $(".datasource-deps");
    const datasourceDepsElementsText = $("h6.datasource-deps");
    const updateDataSourceLabel = $("h6#update-creds-text");
    const addDataSourceLabel = $("h6#add-creds-text");
    const encryptCredsLabel = $("h6#encrypt-creds-text");
    const datasourceList = $("#datasources-list");
    const keyCredentials = $("#key-credentials");
    const windowsCredentialsUsername = $("#window-credentials-username");
    const windowsCredentialsPassword = $("#window-credentials-password");
    const oAuth2Credentials = $("#oauth-credentials");
    const basicCredentialsUsername = $("#basic-credentials-username");
    const basicCredentialsPassword = $("#basic-credentials-password");
    const updateDataSourcePrivacyLevel = $("#update-datasource-privacy-level");
    const addDataSourceGatewayId = $("#gateway-id");
    const datasourceType = $("#datasource-type");
    const datasourceName = $("#datasource-name");
    const connectionDetails = $("#connection-details");
    const addDataSourcePrivacyLevel = $("#add-datasource-privacy-level");
    const encryptCredsGatewayId = $("#encrypt-gateway");
    const responseModal = $(".response-container");
    const responseModalTitle = $("#modal-title");
    const responseModalBody = $("#modal-body");

    responseModal.modal("hide");

    // Disabled as Update creds functionality is default
    disableUpdateDatasourceDeps();

    // Get credential type from the user
    const credType = $("#cred-type");
    credType.on("change", function () {
        credentialKey.hide();
        credentialWindows.hide();
        credentialOAuth2.hide();
        credentialBasic.hide();
        validateUpdateDatasourceForm();
        validateAddDatasourceForm();
        validateEncryptCredsForm();

        switch ((credType.val()).toLowerCase()) {
            case "key":
                credentialKey.show();
                break;
            case "windows":
                credentialWindows.show();
                break;
            case "oauth2":
                credentialOAuth2.show();
                break;
            case "basic":
                credentialBasic.show();
                break;
        }
    });

    // Disable/Enable get data source button until all inputs are filled 
    validateGetDataSourceForm();
    datasetId.keyup(validateGetDataSourceForm);
    groupId.keyup(validateGetDataSourceForm);

    // Disable/Enable update data source button until all inputs are filled 
    validateUpdateDatasourceForm();
    keyCredentials.keyup(validateUpdateDatasourceForm);
    windowsCredentialsUsername.keyup(validateUpdateDatasourceForm);
    windowsCredentialsPassword.keyup(validateUpdateDatasourceForm);
    oAuth2Credentials.keyup(validateUpdateDatasourceForm);
    basicCredentialsUsername.keyup(validateUpdateDatasourceForm);
    basicCredentialsPassword.keyup(validateUpdateDatasourceForm);
    datasourceList.change(validateUpdateDatasourceForm);
    updateDataSourcePrivacyLevel.change(validateUpdateDatasourceForm);

    // Disable/Enable add data source button until all inputs are filled 
    validateAddDatasourceForm();
    addDataSourceGatewayId.keyup(validateAddDatasourceForm);
    datasourceType.keyup(validateAddDatasourceForm);
    datasourceName.keyup(validateAddDatasourceForm);
    connectionDetails.keyup(validateAddDatasourceForm);
    keyCredentials.keyup(validateAddDatasourceForm);
    windowsCredentialsUsername.keyup(validateAddDatasourceForm);
    windowsCredentialsPassword.keyup(validateAddDatasourceForm);
    oAuth2Credentials.keyup(validateAddDatasourceForm);
    basicCredentialsUsername.keyup(validateAddDatasourceForm);
    basicCredentialsPassword.keyup(validateAddDatasourceForm);
    addDataSourcePrivacyLevel.change(validateAddDatasourceForm);

    // Disable/Enable encrypt credentials button until all inputs are filled 
    validateEncryptCredsForm();
    encryptCredsGatewayId.keyup(validateEncryptCredsForm);
    keyCredentials.keyup(validateEncryptCredsForm);
    windowsCredentialsUsername.keyup(validateEncryptCredsForm);
    windowsCredentialsPassword.keyup(validateEncryptCredsForm);
    oAuth2Credentials.keyup(validateEncryptCredsForm);
    basicCredentialsUsername.keyup(validateEncryptCredsForm);
    basicCredentialsPassword.keyup(validateEncryptCredsForm);

    functionality.on("change", function () {
        switch (functionality.val()) {
            case "updateDatasource":
                updateDatasourceContainer.show();
                addDatasourceContainer.hide();
                encryptCredentialsContainer.hide();
                validateGetDataSourceForm();
                resetDatasourceDepsElements();
                break;

            case "addDatasource":
                updateDatasourceContainer.hide();
                addDatasourceContainer.show();
                encryptCredentialsContainer.hide();
                validateAddDatasourceForm();
                showUpdateDatasourceDeps();
                break;

            case "encryptCredentials":
                updateDatasourceContainer.hide();
                addDatasourceContainer.hide();
                encryptCredentialsContainer.show();
                validateEncryptCredsForm();
                showUpdateDatasourceDeps();
                break;
        }
    });

    datasourceList.on("change", function () {
        selectDatasource($(this).val());
    })

    getDatasourceButton.on("click", function () {
        validateUpdateDatasourceForm();
        globalState.datasources = [];

        // Request to get datasources
        $.ajax({
            type: "GET",
            url: Endpoints.GetDatasources,
            dataType: "text",
            data: {
                datasetId: datasetId.val(),
                groupId: groupId.val(),
            },
            success: (message) => {
                globalState.datasources = JSON.parse(message).value;
                populateDatasourcesList(globalState.datasources);
            },
            error: function (err) {
                let errMessageHtml = JSON.parse(err.responseText)["errorMsg"];
                errMessageHtml = errMessageHtml.split("\n").join("<br/>")
                showErrorDetails(errMessageHtml);
            }
        });
    });

    updateCredButton.on("click", function () {
        const datasourceId = datasourceList.val();
        const gatewayId = getGatewayId(datasourceId);
        const privacyLevel = updateDataSourcePrivacyLevel.val();

        const credentials = [];
        switch (credType.val().toLowerCase()) {
            case "key":
                credentials.push(keyCredentials.val());
                break;
            case "windows":
                credentials.push(windowsCredentialsUsername.val());
                credentials.push(windowsCredentialsPassword.val());
                break;
            case "oauth2":
                credentials.push(oAuth2Credentials.val());
                break;
            case "basic":
                credentials.push(basicCredentialsUsername.val());
                credentials.push(basicCredentialsPassword.val());
                break;
        }

        const requestBody = {
            credType: credType.val(),
            credentialsArray: credentials,
            privacyLevel: privacyLevel,
            gatewayId: gatewayId,
            datasourceId: datasourceId
        }

        // Request to update datasources
        $.ajax({
            type: "PUT",
            url: Endpoints.UpdateDatasource,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ "data": requestBody }),
            success: (message) => {
                if (!message) {
                    message = "Successfully updated data source credentials"
                }

                showSuccessMessage(message);
            },
            error: function (err) {
                let errMessageHtml = JSON.parse(err.responseText)["errorMsg"];
                errMessageHtml = errMessageHtml.split("\n").join("<br/>")
                showErrorDetails(errMessageHtml);
            }
        });
    });

    addCredButton.click(function () {

        const credentials = [];
        switch (credType.val().toLowerCase()) {
            case "key":
                credentials.push(keyCredentials.val());
                break;
            case "windows":
                credentials.push(windowsCredentialsUsername.val());
                credentials.push(windowsCredentialsPassword.val());
                break;
            case "oauth2":
                credentials.push(oAuth2Credentials.val());
                break;
            case "basic":
                credentials.push(basicCredentialsUsername.val());
                credentials.push(basicCredentialsPassword.val());
                break;
        }

        const requestBody = {
            gatewayId: addDataSourceGatewayId.val(),
            credType: credType.val(),
            credentialsArray: credentials,
            privacyLevel: addDataSourcePrivacyLevel.val(),
            dataSourceType: datasourceType.val(),
            dataSourceName: datasourceName.val(),
            connectionDetails: connectionDetails.val()
        }

        // Request to add datasources
        $.ajax({
            type: "POST",
            url: Endpoints.AddDatasource,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ "data": requestBody }),
            success: (res) => {
                res = JSON.parse(res);
                let message = "Successfully added data source";

                const newDatasourceId = res?.id;
                if (newDatasourceId) {
                    message += " with ID: " + newDatasourceId;
                }

                showSuccessMessage(message);
            },
            error: function (err) {
                let errMessageHtml = JSON.parse(err.responseText)["errorMsg"];
                errMessageHtml = errMessageHtml.split("\n").join("<br/>")
                showErrorDetails(errMessageHtml);
            }
        });
    });

    encryptButton.on("click", function () {

        const credentials = [];
        switch (credType.val().toLowerCase()) {
            case "key":
                credentials.push(keyCredentials.val());
                break;
            case "windows":
                credentials.push(windowsCredentialsUsername.val());
                credentials.push(windowsCredentialsPassword.val());
                break;
            case "oauth2":
                credentials.push(oAuth2Credentials.val());
                break;
            case "basic":
                credentials.push(basicCredentialsUsername.val());
                credentials.push(basicCredentialsPassword.val());
                break;
        }

        const requestBody = {
            gatewayId: encryptCredsGatewayId.val(),
            credType: credType.val(),
            credentialsArray: credentials,
        }

        // Request to get encrypted credentials
        $.ajax({
            type: "POST",
            url: Endpoints.Encrypt,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ "data": requestBody }),
            success: (res) => {
                const textArea = $("<textarea disabled></textarea>")
                    .css("height", "400px")
                    .css("width", "460px")
                    .text(res);
                showSuccessMessage(textArea, true);
            },
            error: function (err) {
                let errMessageHtml = JSON.parse(err.responseText)["errorMsg"];
                errMessageHtml = errMessageHtml.split("\n").join("<br/>")
                showErrorDetails(errMessageHtml);
            }
        });
    })

    function populateDatasourcesList(datasources) {
        const datasourcesList = $("#datasources-list");

        // Reset options list
        datasourcesList.children("option:not(:first)").remove();

        // Populate select list
        for (let i = 0; i < datasources.length; i++) {
            const { database, server, url } = datasources[i].connectionDetails;

            // Show datasourceId by default
            let datasourceName = datasources[i].datasourceId;
            if (database) {
                datasourceName = server + "." + database + " - " + datasourceName;
            } else {
                datasourceName = url + " - " + datasourceName;
            }

            datasourcesList.append(
                $("<option />")
                    .text(datasourceName)
                    .val(datasources[i].datasourceId)
                    .prop("title", datasources[i].datasourceId)
            );
        }

        if (datasources.length > 0) {
            // Enable the elements for next steps
            showUpdateDatasourceDeps();
        }
    }

    function resetDatasourceDepsElements() {
        globalState.datasources = [];
        populateDatasourcesList(globalState.datasources);
        selectDatasource();
        disableUpdateDatasourceDeps();
        validateUpdateDatasourceForm();
    }

    function selectDatasource(selectedValue) {
        const gatewayId = getGatewayId(selectedValue);

        if (!gatewayId) {
            gatewayContainer.hide();
            return;
        }

        const gatewayOutput = $("#gateway-output");
        gatewayOutput.text(gatewayId);
        gatewayContainer.show();
    }

    function getGatewayId(datasourceId) {
        return globalState.datasources.find((val) => val.datasourceId === datasourceId)?.gatewayId;
    }

    function showSuccessMessage(message, isHtml) {
        responseModalTitle.text("Success");
        responseModalBody.empty();

        if (isHtml) {
            responseModalBody.append(message);
        } else {
            responseModalBody.text(message);
        }

        // Show message in modal
        responseModal.modal("show");
    }

    function showErrorDetails(errorDetails) {
        responseModalTitle.text("Error Details");
        responseModalBody.html(errorDetails);

        // Show error details in modal
        responseModal.modal("show");
    }

    // Disables the elements dependent on get datasources of Update datasource functionality
    function disableUpdateDatasourceDeps() {
        datasourceDepsElements.prop("disabled", true);
        datasourceDepsElementsText.removeClass(ACTIVE_TEXT).addClass(INACTIVE_TEXT);
    }

    // Shows the elements dependent on get datasources of Update datasource functionality
    function showUpdateDatasourceDeps() {
        datasourceDepsElements.prop("disabled", false);
        datasourceDepsElementsText.removeClass(INACTIVE_TEXT).addClass(ACTIVE_TEXT);
    }

    // Disables or enables get data source functionality depending on the input provided by the user
    function validateGetDataSourceForm() {
        // Check if groupId and datasetId is provided by user to activate functionality
        if (groupId.val().length > 0 && datasetId.val().length > 0) {
            getDatasourceButton.prop("disabled", false);
            getDatasourceButton.removeClass(DISABLED).addClass(ENABLED);
        } else {
            getDatasourceButton.prop("disabled", true);
            getDatasourceButton.removeClass(ENABLED).addClass(DISABLED);
        }
    }

    // Disables or enables update data source functionality depending on the input provided by the user
    function validateUpdateDatasourceForm() {
        const isDisabled = credType.prop("disabled");

        // Check if update data source form disabled
        if (isDisabled) {
            disableDOMElements(updateDataSourceLabel, updateCredButton);
        } else {
            // Check if all inputs are provided by user to activate the functionality
            if (validCredentials()) {
                enableDOMElements(updateDataSourceLabel, updateCredButton);
            } else {
                disableDOMElements(updateDataSourceLabel, updateCredButton);
            }
        }
    }

    // Disables or enables add data source functionality depending on the input provided by the user
    function validateAddDatasourceForm() {
        // Check if all inputs are provided by user to activate the functionality
        if (
            addDataSourceGatewayId.val().length > 0 &&
            datasourceType.val().length > 0 &&
            datasourceName.val().length > 0 &&
            connectionDetails.val().length > 0 &&
            validCredentials()
          ) {
            enableDOMElements(addDataSourceLabel, addCredButton);
        } else {
            disableDOMElements(addDataSourceLabel, addCredButton);
        }
    }

    // Disables or enables add data source functionality depending on the input provided by the user
    function validateEncryptCredsForm() {
        // Check if all inputs are provided by user to activate the functionality
        if (encryptCredsGatewayId.val().length > 0 && validCredentials()) {
            enableDOMElements(encryptCredsLabel, encryptButton);
        } else {
            disableDOMElements(encryptCredsLabel, encryptButton);
        }
    }

    // Validates credentials provided by the user
    function validCredentials() {
        return ((credType.val().toLowerCase() === "key" && keyCredentials.val().length > 0) ||
        (credType.val().toLowerCase() === "windows" &&
          windowsCredentialsUsername.val().length > 0 &&
          windowsCredentialsPassword.val().length > 0) ||
        (credType.val().toLowerCase() === "oauth2" &&
          oAuth2Credentials.val().length > 0) ||
        (credType.val().toLowerCase() === "basic" &&
          basicCredentialsUsername.val().length > 0 &&
          basicCredentialsPassword.val().length > 0))
    }

    // Disables DOM elements
    function disableDOMElements(labelElement, buttonElement) {
        labelElement.removeClass(ACTIVE_TEXT).addClass(INACTIVE_TEXT);
        buttonElement.prop("disabled", true);
        buttonElement.removeClass(ENABLED).addClass(DISABLED);
    }

    // Enables DOM elements
    function enableDOMElements(labelElement, buttonElement) {
        labelElement.removeClass(INACTIVE_TEXT).addClass(ACTIVE_TEXT);
        buttonElement.prop("disabled", false);
        buttonElement.removeClass(DISABLED).addClass(ENABLED);
    }
});
