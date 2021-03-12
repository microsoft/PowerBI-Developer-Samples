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

    const updateDatasourceContainer = $(".update-datasource-container");
    const addDatasourceContainer = $(".add-datasource-container");
    const encryptCredentialsContainer = $(".encrypt-credentials-container");

    const gatewayContainer = $(".gateway-container");

    const credentialKey = $("#credential-key");
    const credentialWindows = $("#credential-windows");
    const credentialOAuth2 = $("#credential-oauth2");
    const credentialBasic = $("#credential-basic");

    const updateCredButton = $("#update-credentials");
    const addCredButton = $("#add-datasource");

    const datasourceList = $("#datasources-list");
    const successContainer = $(".success-container");
    const errorContainer = $(".error-container");

    const encryptButton = $("#encrypt-button");
    const functionality = $("#functionality-select");

    const datasourceDepsElements = $(".datasource-deps");
    const datasourceDepsElementsText = $("h6.datasource-deps");

    // Disabled as Update creds functionality is default
    disableUpdateDatasourceDeps();

    const responseModal = $(".response-container");
    const responseModalTitle = $("#modal-title");
    const responseModalBody = $("#modal-body");
    responseModal.modal("hide");

    // Get credential type from the user
    const credType = $("#cred-type");
    credType.on("change", function () {
        credentialKey.hide();
        credentialWindows.hide();
        credentialOAuth2.hide();
        credentialBasic.hide();

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

    functionality.on("change", function () {
        switch (functionality.val()) {
            case "updateDatasource":
                updateDatasourceContainer.show();
                addDatasourceContainer.hide();
                encryptCredentialsContainer.hide();
                resetDatasourceDepsElements()
                break;
            
            case "addDatasource":
                updateDatasourceContainer.hide();
                addDatasourceContainer.show();
                encryptCredentialsContainer.hide();
                showUpdateDatasourceDeps();
                break;

            case "encryptCredentials":
                updateDatasourceContainer.hide();
                addDatasourceContainer.hide();
                encryptCredentialsContainer.show();
                showUpdateDatasourceDeps();
                break;
        }
    });

    datasourceList.on("change", function () {
        selectDatasource($(this).val());
    })

    $("#get-datasources").on("click", function() {
        globalState.datasources = [];

        // Get user inputs
        datasetId = $("#dataset-id").val();
        groupId = $("#group-id").val();

        // Request to get datasources
        $.ajax({
            type: "GET",
            url: Endpoints.GetDatasources,
            dataType: "text",
            data: {
                DatasetId: datasetId,
                GroupId: groupId,
            },
            success: (message) => {
                globalState.datasources = JSON.parse(message).value;
                populateDatasourcesList(globalState.datasources);
            },
            error: function (err) {
                showErrorDetails(err.responseText);
            }
        });
    });

    updateCredButton.on("click", function() {

        // TODO: Add check for datasourceId
        const datasourceId = datasourceList.val();
        const gatewayId = getGatewayId(datasourceId);
        const privacyLevel = $("#update-datasource-privacy-level").val();

        const credentials = [];
        switch (credType.val().toLowerCase()) {
            case "key":
                credentials.push($("#key-credentials").val());
                break;
            case "windows":
                credentials.push($("#window-credentials-username").val());
                credentials.push($("#window-credentials-password").val());
                break;
            case "oauth2":
                credentials.push($("#oauth-credentials").val());
                break;
            case "basic":
                credentials.push($("#basic-credentials-username").val());
                credentials.push($("#basic-credentials-password").val());
                break;
        }

        // Request to update datasources
        $.ajax({
            type: "POST",
            url: Endpoints.UpdateDatasource,
            data: {
                CredentialType: credType.val(),
                Credentials: credentials,
                PrivacyLevel: privacyLevel,
                GatewayId: gatewayId,
                DatasourceId: datasourceId
            },
            success: (message) => {
                if (!message) {
                    message = "Credentials were updated successfully"
                }

                showSuccessMessage(message);
            },
            error: function (err) {
                showErrorDetails(err.responseText);
            }
        });
    });

    addCredButton.click(function () {
        successContainer.hide();
        errorContainer.hide();

        // Get gatewayId from the user
        const gatewayId = $("#gateway-id").val();
        const privacyLevel = $("#add-datasource-privacy-level").val();
        const datasourceType = $("#datasource-type").val();
        const datasourceName = $("#datasource-name").val();
        const connectionDetails = $("#connection-details").val();

        const credentials = [];
        switch (credType.val().toLowerCase()) {
            case "key":
                credentials.push($("#key-credentials").val());
                break;
            case "windows":
                credentials.push($("#window-credentials-username").val());
                credentials.push($("#window-credentials-password").val());
                break;
            case "oauth2":
                credentials.push($("#oauth-credentials").val());
                break;
            case "basic":
                credentials.push($("#basic-credentials-username").val());
                credentials.push($("#basic-credentials-password").val());
                break;
        }

        // Request to add datasources
        $.ajax({
            type: "POST",
            url: Endpoints.AddDatasource,
            data: {
                GatewayId: gatewayId,
                CredentialType: credType.val(),
                Credentials: credentials,
                PrivacyLevel: privacyLevel,
                DatasourceType: datasourceType,
                DatasourceName: datasourceName,
                ConnectionDetails: connectionDetails
            },
            success: (message) => {
                if (!message) {
                    message = "Datasource added successfully"
                }

                showSuccessMessage(message);
            },
            error: function (err) {
                showErrorDetails(err.responseText);
            }
        });
    });

    encryptButton.on("click", function () {

        // Get gatewayId from the user
        const gatewayId = $("#encrypt-gateway").val();
        const credentials = [];
        switch (credType.val().toLowerCase()) {
            case "key":
                credentials.push($("#key-credentials").val());
                break;
            case "windows":
                credentials.push($("#window-credentials-username").val());
                credentials.push($("#window-credentials-password").val());
                break;
            case "oauth2":
                credentials.push($("#oauth-credentials").val());
                break;
            case "basic":
                credentials.push($("#basic-credentials-username").val());
                credentials.push($("#basic-credentials-password").val());
                break;
        }

        // Request to get encrypted credentials
        $.ajax({
            type: "POST",
            url: Endpoints.Encrypt,
            data: {
                GatewayId: gatewayId,
                CredentialType: credType.val(),
                Credentials: credentials,
            },
            success: (res) => {
                const textArea = $("<textarea disabled></textarea>")
                    .css("height", "400px")
                    .css("width", "460px")
                    .text(res);
                showSuccessMessage(textArea, true);
            },
            error: function (err) {
                showErrorDetails(err.responseText);
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
        responseModalBody.text(errorDetails);

        // Show error details in modal
        responseModal.modal("show");
    }

    // Disables the elements dependent on get datasources of Update datasource functionality
    function disableUpdateDatasourceDeps() {
        datasourceDepsElements.prop("disabled", true);
        datasourceDepsElementsText.css('color', 'grey');
        updateCredButton.removeClass("btn-primary").addClass("btn-secondary");
    }

    // Shows the elements dependent on get datasources of Update datasource functionality
    function showUpdateDatasourceDeps() {
        datasourceDepsElements.prop("disabled", false);
        datasourceDepsElementsText.css('color', 'black');
        updateCredButton.removeClass("btn-secondary").addClass("btn-primary");
    }
});
