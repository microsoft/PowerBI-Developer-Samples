<!-- Copyright (c) Microsoft Corporation.
Licensed under the MIT license. -->

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="base" value="${fn:substring(url, 0, fn:length(url) - fn:length(req.requestURI))}${req.contextPath}/" />

<!DOCTYPE html>
<html lang="en">

<head>
    <title>Encrypt Power BI Data Source Credentials</title>
    <base href="${base}" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <link href="resources/css/style.css" rel="stylesheet" />
</head>

<body>
    <header class="col-lg-12 col-md-12 col-sm-12 shadow">
        <div>
            Encrypt Power BI Data Source Credentials
        </div>
    </header>
    <main class="row">
        <section id="text-container" class="col mb-8 ml-8">
            <div>
                <div>
                    <h5>Update data source</h5>
                    Encrypt the credentials of Power BI data source and update them using the API: 
                    <a href="https://docs.microsoft.com/en-us/rest/api/power-bi/gateways/updatedatasource#credentialdetails">Update data source credentials</a>.
                    <br><br>
                    <h5>Add data source</h5>
                    Encrypt the credentials of Power BI data source and add new data source using the API: 
                    <a href="https://docs.microsoft.com/en-us/rest/api/power-bi/gateways/createdatasource">Add data source</a>.
                    <br><br>
                    <h5>Encrypt credentials</h5>
                    Get the encrypted credentials of Power BI data source.
                </div>
                <br>
                <div>Encryption code is present in the following files:
                    <ol>
                        <li>helper/AuthenticatedEncryption.java</li>
                        <li>helper/AsymmetricHigherKeyEncryptionHelper</li>
                        <li>helper/Asymmetric1024KeyEncryptionHelper</li>
                    </ol>
                </div>
                <div>Sample's code is present in the following files:
                    <ol>
                        <li>controllers/DataSourceController.java</li>
                        <li>services/UpdateCredentialsService.java</li>
                        <li>services/AddCredentialsService.java</li>
                        <li>services/AsymmetricKeyEncryptorService.java</li>
                    </ol>
                </div>
            </div>
        </section>
        <section id="input-container" class="input-container col mb-4 ml-5 mt-4">
            <div id="task-container">
                <h6>1. Select functionality</h6>
                <select name="functionality" id="functionality-select" class="input-element">
                    <option value="updateDatasource">Update data source</option>
                    <option value="addDatasource">Add data source</option>
                    <option value="encryptCredentials">Encrypt credentials</option>
                </select>
            </div>
            <!-- Update Datasource Form -->
            <div class="update-datasource-container">
                <div class="row">
                    <div class="id-container">
                        <h6>Group ID</h6>
                        <input id="group-id" type="text" class="title input-element" name="title"
                            placeholder="E.g. 00000000-0000-0000-0000-000000000000" />
                    </div>
                    <br>
                    <div class="id-container">
                        <h6>Dataset ID</h6>
                        <input id="dataset-id" type="text" class="title input-element" name="title"
                            placeholder="E.g. 00000000-0000-0000-0000-000000000000" />
                    </div>
                </div>
                <button id="get-datasources" class="btn btn-primary send-button">Get data sources</button>
                <br><br>
                <h6 class="datasource-deps">2. Choose a data source</h6>
                <select name="datasources-list" id="datasources-list" class="input-element datasource-deps">
                    <option value="Key">Choose data source</option>
                </select>
                <div class="gateway-container">
                    <h6>Gateway ID</h6>
                    <div id="gateway-output"></div>
                </div>
            </div>
            <!-- Add Datasource Form -->
            <div class="add-datasource-container">
                <div id="gateway-input">
                    <h6>Gateway ID</h6>
                    <input id="gateway-id" type="text" class="title input-element" name="title"
                        placeholder="E.g. 00000000-0000-0000-0000-000000000000" />
                </div>
                <br>
                <div class="row">
                    <div class="id-container" id="add-input-id">
                        <h6>Data source type</h6>
                        <input id="datasource-type" type="text" class="title input-element" name="title"
                            placeholder="E.g. SQL" />
                    </div>
                    <br>
                    <div class="id-container">
                        <h6>Data source name</h6>
                        <input id="datasource-name" type="text" class="title input-element" name="title"
                            placeholder="E.g. Sample data source" />
                    </div>
                </div>
                <br>
                <div>
                    <h6>Connection details</h6>
                    <input id="connection-details" type="text" class="title input-element" name="title"
                        placeholder='E.g. {"server":"MyServer","database":"MyDatabase"}' />
                </div>
            </div>
            <!-- Encrypt-Credentials Form -->
            <div class="encrypt-credentials-container">
                <h6>Gateway ID</h6>
                <input id="encrypt-gateway" type="text" class="title input-element" name="title"
                    placeholder="E.g. 00000000-0000-0000-0000-000000000000" />
            </div>
            <!-- Common credentials input -->
            <div>
                <br>
                <div>
                    <h6 class="datasource-deps">Credential type</h6>
                    <select name="credentials-type" id="cred-type" class="input-element datasource-deps">
                        <option value="Key">Key credentials</option>
                        <option value="Basic">Basic credentials</option>
                        <option value="OAuth2">OAuth2 credentials</option>
                        <option value="Windows">Windows credentials</option>
                    </select>
                </div>
                <br>
                <div id="credential-key">
                    <h6 class="datasource-deps">Key credentials</h6>
                    <input id="key-credentials" class="input-element title datasource-deps" type="text" name="title"
                        placeholder="Key value" />
                </div>
                <div id="credential-windows">
                    <h6 class="datasource-deps"> Windows credentials</h6>
                    <input id="window-credentials-username" class="input-element title datasource-deps" type="text" name="title" placeholder="Username" />
                    <input id="window-credentials-password" class="input-element password-text title datasource-deps " type="password"
                        name="title" placeholder="Password" />
                </div>
                <div id="credential-oauth2">
                    <h6 class="datasource-deps"> OAuth2 credentials</h6>
                    <input id="oauth-credentials" class="input-element datasource-deps" type="text" name="title"
                        placeholder="Access token" />
                </div>
                <div id="credential-basic">
                    <h6 class="datasource-deps">Basic credentials</h6>
                    <input id="basic-credentials-username" class="input-element title datasource-deps" type="text"
                        name="title" placeholder="Username" />
                    <input id="basic-credentials-password" class="input-element title password-text datasource-deps" type="password"
                        name="title" placeholder="Password" />
                </div>
                <br/>
            </div>
            <!-- Update Datasource Form -->
            <div class="update-datasource-container">
                <h6 class="datasource-deps">Privacy level</h6>
                <select name="privacy-level" id="update-datasource-privacy-level" class="input-element datasource-deps">
                    <option value="None">None</option>
                    <option value="Private">Private</option>
                    <option value="Organizational">Organizational</option>
                    <option value="Public">Public</option>
                </select>
                <br><br>
                <div id="update-credentials-label">
                    <h6 id="update-creds-text" class="inactive-text">3. Set new credentials</h6>
                    <button id="update-credentials" class="btn btn-primary send-button">Update credentials</button>
                </div>
                <br>
            </div>
            <!-- Add Datasource Form -->
            <div class="add-datasource-container">
                <h6>Privacy level</h6>
                <select name="privacy-level" id="add-datasource-privacy-level" class="input-element">
                    <option value="None">None</option>
                    <option value="Private">Private</option>
                    <option value="Organizational">Organizational</option>
                    <option value="Public">Public</option>
                </select>
                <br><br>
                <div id="add-datasource-label">
                    <h6 id="add-creds-text" class="inactive-text">2. Add data source with credentials</h6>
                    <button id="add-datasource" class="btn btn-primary send-button">Add data source</button>
                </div>
            </div>
            <!-- Encrypt-Credentials Form -->
            <div class="encrypt-credentials-container">
                <div id="encrypt-button-container">
                    <h6 id="encrypt-creds-text" class="inactive-text">2. Get the encrypted credentials</h6>
                    <button id="encrypt-button" class="btn btn-primary send-button">Encrypt Credentials</button>
                </div>
            </div>
        </section>
    </main>
    <!-- Modal to display success and error messages -->
    <div class="modal response-container" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="modal-title" class="modal-title"></h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div id="modal-body" class="modal-body"></div>
          </div>
        </div>
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
    <script>
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

            // Disable as Update Creds functionality is default
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
                        resetDatasourceDepsElements()
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
                        showErrorDetails(err.responseText);
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

                const requestBody = {
                    credType: credType.val(),
                    credentialsArray: credentials,
                    privacyLevel: privacyLevel,
                    gatewayId: gatewayId,
                    datasourceId: datasourceId
                }

                $.ajax({
                    type: "POST",
                    url: Endpoints.UpdateDatasource,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(requestBody),
                    success: (message) => {
                        if (!message) {
                            message = "Successfully updated data source credentials"
                        }

                        showSuccessMessage(message);
                    },
                    error: function (err) {
                        showErrorDetails(err.responseText);
                    }
                });
            });

            addCredButton.click(function () {
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

                const requestBody = {
                    gatewayId: addDataSourceGatewayId.val(),
                    credType: credType.val(),
                    credentialsArray: credentials,
                    privacyLevel: addDataSourcePrivacyLevel.val(),
                    dataSourceType: datasourceType.val(),
                    dataSourceName: datasourceName.val(),
                    connectionDetails: connectionDetails.val()
                }

                $.ajax({
                    type: "POST",
                    url: Endpoints.AddDatasource,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(requestBody),
                    success: (res) => {
                        let message = "Successfully added data source";

                        const newDatasourceId = res?.id;
                        if (newDatasourceId) {
                            message += " with ID: " + newDatasourceId;
                        }

                        showSuccessMessage(message);
                    },
                    error: function (err) {
                        showErrorDetails(err.responseText);
                    }
                });
            });

            encryptButton.on("click", function () {

                const credentials = [];
                switch (credType.val().toLowerCase()) {
                    case "key":
                        credentials.push($("#keyCredentials").val());
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

                const requestBody = {
                    gatewayId: encryptCredsGatewayId.val(),
                    credType: credType.val(),
                    credentialsArray: credentials,
                }

                $.ajax({
                    type: "POST",
                    url: Endpoints.Encrypt,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(requestBody),
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
                responseModalBody.text(errorDetails);

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
    </script>
</body>
</html>