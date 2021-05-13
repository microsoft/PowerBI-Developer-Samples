// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.encryptcredentialsample.encryptcredential.controllers;

import java.net.MalformedURLException;
import java.util.List;
import java.util.concurrent.ExecutionException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.encryptcredentialsample.encryptcredential.models.AddDatasourceRequest;
import com.encryptcredentialsample.encryptcredential.models.Gateway;
import com.encryptcredentialsample.encryptcredential.models.GetDatasourcesResponse;
import com.encryptcredentialsample.encryptcredential.models.UpdateDatasourceCredentialsRequest;
import com.encryptcredentialsample.encryptcredential.services.AddCredentialsService;
import com.encryptcredentialsample.encryptcredential.services.AsymmetricKeyEncryptorService;
import com.encryptcredentialsample.encryptcredential.services.AzureADService;
import com.encryptcredentialsample.encryptcredential.services.GetDatasourceData;
import com.encryptcredentialsample.encryptcredential.services.UpdateCredentialsService;
import com.encryptcredentialsample.encryptcredential.services.Utils;

@Controller
public class DataSourceController extends HttpServlet {

	static final Logger logger = LoggerFactory.getLogger(DataSourceController.class);

	/**
	 * Home page controller
	 * 
	 * @return Homepage (jsp)
	 */
	@GetMapping(path = "/")
	public ModelAndView homePage() {

		// Return homepage JSP view
		return new ModelAndView("Home");
	}

	/**
	 * Get datasources controller
	 * 
	 * @return ResponseEntity<String> body contains the JSON object with list of
	 *         datasources for given datasetId and groupId
	 * @throws JsonProcessingException
	 * @throws JsonMappingException
	 */
	// We return different data types on success and failure, hence return type is <?>
	@GetMapping(path = "/getdatasourcesingroup")
	@ResponseBody
	public ResponseEntity<?> getDataSourcesInGroup(HttpServletRequest request) {
		try {
			// Get access token
			String accessToken = AzureADService.getAccessToken();

			String datasetId = request.getParameter("datasetId");
			String groupId = request.getParameter("groupId");

			GetDatasourcesResponse datasources = GetDatasourceData.getDatasourcesInGroup(accessToken, datasetId, groupId);
			return ResponseEntity.ok(datasources);
		} catch (HttpClientErrorException hcex) {
			return generateResponseForException(hcex);
		} catch (Exception ex) {
			// Log error message
			logger.error(ex.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/updatedatasource")
	public ResponseEntity<?> updateDataController(@RequestBody UpdateDatasourceCredentialsRequest request) throws Exception {
		try {
			// Get access token and Update Datasource Credentials
			String accessToken = AzureADService.getAccessToken();

			Gateway gateway = GetDatasourceData.getGateway(accessToken, request.gatewayId);

			return UpdateCredentialsService.updateDatasource(
					accessToken, 
					request.credType, 
					request.privacyLevel, 
					request.credentialsArray, 
					gateway.publicKey, 
					request.gatewayId, 
					request.datasourceId);
		} catch (HttpClientErrorException hcex) {
			return generateResponseForException(hcex);
		} catch (Exception ex) {
			// Log error message
			logger.error(ex.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/adddatasource")
	public ResponseEntity<?> addDataSourceController(@RequestBody AddDatasourceRequest request, HttpServletResponse response) throws Exception {
		try {
			// Get access token and add data source
			String accessToken = AzureADService.getAccessToken();

			Gateway gateway = GetDatasourceData.getGateway(accessToken, request.gatewayId);

			return AddCredentialsService.addDataSource(
					accessToken, 
					request.gatewayId, 
					request.dataSourceType, 
					request.connectionDetails, 
					request.dataSourceName, 
					request.credType, 
					request.privacyLevel, 
					request.credentialsArray, 
					gateway.publicKey);
		} catch (HttpClientErrorException hcex) {
			return generateResponseForException(hcex);
		} catch (Exception ex) {
			// Log error message
			logger.error(ex.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
		}
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/encrypt")
	public ResponseEntity<String> encryptCredentialsController(@RequestBody UpdateDatasourceCredentialsRequest request) throws Exception {
		try {
			// Get access token and Update Datasource Credentials
			String accessToken = AzureADService.getAccessToken();

			Gateway selectedGateway = GetDatasourceData.getGateway(accessToken, request.gatewayId);

			// Serialize credentials for encryption
			String serializedCredentials = Utils.serializeCredentials(request.credentialsArray, request.credType);
			String credentials = null;
			// Name is null in case of cloud gateway
			if(selectedGateway.Name == null) {
				credentials = serializedCredentials;
			} else {
				// Encrypt the credentials Asymmetric Key Encryption
				AsymmetricKeyEncryptorService credentialsEncryptor = new AsymmetricKeyEncryptorService(selectedGateway.publicKey);
				credentials = credentialsEncryptor.encodeCredentials(serializedCredentials);
			}			
			
			return ResponseEntity.status(HttpStatus.OK).body(credentials);
		} catch (HttpClientErrorException hcex) {
			return generateResponseForException(hcex);
		} catch (Exception ex) {
			// Log error message
			logger.error(ex.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
		}
	}
	
	public ResponseEntity<String> generateResponseForException(HttpClientErrorException ex) {
		// Build the error message
		StringBuilder errMsgStringBuilder = new StringBuilder("Error ");
		errMsgStringBuilder.append(ex.getMessage());

		// Get Request Id
		HttpHeaders header = ex.getResponseHeaders();
		List<String> requestIds = header.get("requestId");
		if (requestIds != null) {
			for (String requestId : requestIds) {
				errMsgStringBuilder.append("\nRequest Id: ");
				errMsgStringBuilder.append(requestId);
			}
		}

		// Error message string to be returned
		String errMsg = errMsgStringBuilder.toString();

		// Log error message
		logger.error(errMsg);
		return ResponseEntity.status(ex.getStatusCode()).body(errMsg);
	}
}
