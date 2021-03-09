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
    <title>Encrypt Power BI Datasource Credentials</title>
    <base href="${base}" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <link href="resources/css/style.css" rel="stylesheet" />
</head>

<body>
    <header class="col-lg-12 col-md-12 col-sm-12 shadow">
        <div>
            Encrypt Credentials of Power BI Data source
        </div>
    </header>
    <main class="row">
        <section id="text-container" class="col mb-8 ml-8">
            <div>
                <div>
                    <h5>Update Datasource</h5>
                    Encrypt the credentials of Power BI datasource and update them using the API: 
                    <a href="https://docs.microsoft.com/en-us/rest/api/power-bi/gateways/updatedatasource#credentialdetails">Update Datasource Credentials</a>.
                    <br><br>
                    <h5>Add Datasource</h5>
                    Encrypt the credentials of Power BI Data Source and add new datasource using the API: 
                    <a href="https://docs.microsoft.com/en-us/rest/api/power-bi/gateways/createdatasource">Add Datasource</a>.
                    <br><br>
                    <h5>Encrypt Credentials</h5>
                    Get the encrypted credentials of Power BI Data Source.
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
                    <option value="updateDatasource">Update Datasource</option>
                    <option value="addDatasource">Add Datasource</option>
                    <option value="encryptCredentials">Encrypt Credentials</option>
                </select>
            </div>
            <!-- Update Datasource Form -->
            <div class="update-datasource-container">
                <div class="row">
                    <div class="id-container">
                        <h6>GroupId</h6>
                        <input id="group-id" type="text" class="title input-element" name="title"
                            placeholder="E.g. 00000000-0000-0000-0000-000000000000" />
                    </div>
                    <br>
                    <div class="id-container">
                        <h6>DatasetId</h6>
                        <input id="dataset-id" type="text" class="title input-element" name="title"
                            placeholder="E.g. 00000000-0000-0000-0000-000000000000" />
                    </div>
                </div>
                <button id="get-datasources" class="btn btn-primary send-button">Get Datasources</button>
                <br><br>
                <h6 class="datasource-deps">2. Choose a datasource</h6>
                <select name="datasources-list" id="datasources-list" class="input-element datasource-deps">
                    <option value="Key">Choose Datasource</option>
                </select>
                <div class="gateway-container">
                    <h6>Gateway id:</h6>
                    <div id="gateway-output"></div>
                </div>
            </div>
            <!-- Add Datasource Form -->
            <div class="add-datasource-container">
                <div id="gateway-input">
                    <h6>GatewayId</h6>
                    <input type="text" class="title input-element" name="title"
                        placeholder="E.g. 00000000-0000-0000-0000-000000000000" />
                </div>
                <br>
                <div class="row">
                    <div class="id-container" id="addInputId">
                        <h6>DataSource Type</h6>
                        <input id="datasourceType" type="text" class="title input-element" name="title"
                            placeholder="E.g. SQL" />
                    </div>
                    <br>
                    <div class="id-container">
                        <h6>DataSource Name</h6>
                        <input id="datasourceName" type="text" class="title input-element" name="title"
                            placeholder="E.g. Sample Datasource" />
                    </div>
                </div>
                <br>
                <div>
                    <h6>Connection Details</h6>
                    <input id="connectionDetails" type="text" class="title input-element" name="title"
                        placeholder='E.g. {"server":"MyServer","database":"MyDatabase"}' />
                </div>
            </div>
            <!-- Encrypt-Credentials Form -->
            <div class="encrypt-credentials-container">
                <h6>Gateway Id</h6>
                <input id="encrypt-gateway" type="text" class="title input-element" name="title"
                    placeholder="E.g. 00000000-0000-0000-0000-000000000000" />
            </div>
            <!-- Common credentials input -->
            <div>
                <br>
                <div>
                    <h6 class="datasource-deps">Credential Type</h6>
                    <select name="credentials-type" id="cred-type" class="input-element datasource-deps">
                        <option value="Key">Key Credentials</option>
                        <option value="Basic">Basic Credentials</option>
                        <option value="OAuth2">OAuth2 Credentials</option>
                        <option value="Windows">Windows Credentials</option>
                    </select>
                </div>
                <br>
                <div id="credential-key">
                    <h6 class="datasource-deps">Key Credentials</h6>
                    <input id="keyCredentials" class="input-element title datasource-deps" type="text" name="title"
                        placeholder="Key Value" />
                </div>
                <div id="credential-windows">
                    <h6 class="datasource-deps"> Windows Credentials</h6>
                    <input id="windowCredentialsUsername" class="input-element title datasource-deps" type="text" name="title" placeholder="Username" />
                    <input id="windowCredentialsPassword" class="input-element password-text title datasource-deps " type="password"
                        name="title" placeholder="Password" />
                </div>
                <div id="credential-oauth2">
                    <h6 class="datasource-deps"> OAuth2 Credentials</h6>
                    <input id="oauthCredentials" class="input-element datasource-deps" type="text" name="title"
                        placeholder="Access Token" />
                </div>
                <div id="credential-basic">
                    <h6 class="datasource-deps">Basic Credentials</h6>
                    <input id="basicCredentialsUsername" class="input-element title datasource-deps" type="text"
                        name="title" placeholder="Username" />
                    <input id="basicCredentialsPassword" class="input-element title password-text datasource-deps" type="password"
                        name="title" placeholder="Password" />
                </div>
                <br/>
            </div>
            <!-- Update Datasource Form -->
            <div class="update-datasource-container">
                <h6 class="datasource-deps">Privacy Level</h6>
                <select name="privacy-level" id="update-datasource-privacy-level" class="input-element datasource-deps">
                    <option value="None">None</option>
                    <option value="Private">Private</option>
                    <option value="Organizational">Organizational</option>
                    <option value="Public">Public</option>
                </select>
                <br><br>
                <div id="update-credentials-label">
                    <h6 class="datasource-deps">3. Set new credentials</h6>
                    <button id="update-credentials" class="btn btn-primary send-button datasource-deps">Update Credentials</button>
                </div>
                <br>
            </div>
            <!-- Add Datasource Form -->
            <div class="add-datasource-container">
                <h6>Privacy Level</h6>
                <select name="privacy-level" id="add-datasource-privacy-level" class="input-element">
                    <option value="None">None</option>
                    <option value="Private">Private</option>
                    <option value="Organizational">Organizational</option>
                    <option value="Public">Public</option>
                </select>
                <br><br>
                <div id="add-datasource-label">
                    <h6>2. Add datasource with credentials</h6>
                    <button id="add-datasource" class="btn btn-primary send-button">Add Datasource</button>
                </div>
            </div>
            <!-- Encrypt-Credentials Form -->
            <div class="encrypt-credentials-container">
                <div id="encrypt-button-container">
                    <h6>2. Get the encrypted credentials</h6>
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

            const Endpoints = {
                GetDatasources: "/encryptcredential/getdatasourcesingroup",
                UpdateDatasource: "/encryptcredential/updatedatasource",
                AddDatasource: "/encryptcredential/adddatasource",
                Encrypt: "/encryptcredential/encrypt"
            };

            const updateDatasourceContainer = $(".update-datasource-container");
            const addDatasourceContainer = $(".add-datasource-container").hide();
            const encryptCredentialsContainer = $(".encrypt-credentials-container").hide();
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

            // Disable as Update Creds functionality is default
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

            $("#get-datasources").on("click", function () {
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
                        datasetId: datasetId,
                        groupId: groupId,
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
                const privacyLevel = $("#update-datasource-privacy-level").val();

                const credentials = [];
                switch (credType.val().toLowerCase()) {
                    case "key":
                        credentials.push($("#keyCredentials").val());
                        break;
                    case "windows":
                        credentials.push($("#windowCredentialsUsername").val());
                        credentials.push($("#windowCredentialsPassword").val());
                        break;
                    case "oauth2":
                        credentials.push($("#oauthCredentials").val());
                        break;
                    case "basic":
                        credentials.push($("#basicCredentialsUsername").val());
                        credentials.push($("#basicCredentialsPassword").val());
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
                const gatewayId = $("#gatewayId").val();
                const privacyLevel = $("#add-datasource-privacy-level").val();
                const datasourceType = $("#datasourceType").val();
                const datasourceName = $("#datasourceName").val();
                const connectionDetails = $("#connectionDetails").val();

                const credentials = [];
                switch (credType.val().toLowerCase()) {
                    case "key":
                        credentials.push($("#keyCredentials").val());
                        break;
                    case "windows":
                        credentials.push($("#windowCredentialsUsername").val());
                        credentials.push($("#windowCredentialsPassword").val());
                        break;
                    case "oauth2":
                        credentials.push($("#oauthCredentials").val());
                        break;
                    case "basic":
                        credentials.push($("#basicCredentialsUsername").val());
                        credentials.push($("#basicCredentialsPassword").val());
                        break;
                }

                const requestBody = {
                    gatewayId: gatewayId,
                    credType: credType.val(),
                    credentialsArray: credentials,
                    privacyLevel: privacyLevel,
                    dataSourceType: datasourceType,
                    dataSourceName: datasourceName,
                    connectionDetails: connectionDetails
                }

                $.ajax({
                    type: "POST",
                    url: Endpoints.AddDatasource,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(requestBody),
                    success: (res) => {
                        let message = "Datasource added successfully";

                        const newDatasourceId = res?.id;
                        if (newDatasourceId) {
                            message += " with id: " + newDatasourceId;
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
                        credentials.push($("#keyCredentials").val());
                        break;
                    case "windows":
                        credentials.push($("#windowCredentialsUsername").val());
                        credentials.push($("#windowCredentialsPassword").val());
                        break;
                    case "oauth2":
                        credentials.push($("#oauthCredentials").val());
                        break;
                    case "basic":
                        credentials.push($("#basicCredentialsUsername").val());
                        credentials.push($("#basicCredentialsPassword").val());
                        break;
                }

                const requestBody = {
                    gatewayId: gatewayId,
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
                responseModalTitle.text("Success:");
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
                responseModalTitle.text("Error Details:");
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
    </script>
</body>
</html>