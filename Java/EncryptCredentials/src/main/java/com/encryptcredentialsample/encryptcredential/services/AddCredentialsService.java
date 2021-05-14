// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.encryptcredentialsample.encryptcredential.services;

import java.io.IOException;
import org.apache.http.client.ClientProtocolException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.encryptcredentialsample.encryptcredential.models.CredentialDetails;
import com.encryptcredentialsample.encryptcredential.models.GatewayPublicKey;
import com.encryptcredentialsample.encryptcredential.models.PublishDatasourceToGatewayRequest;

public class AddCredentialsService {
	// Make GET requests to obtain gatewayId, datasourceId and Public key to encrypt the data
	public static ResponseEntity<String> addDataSource(
			String accessToken, 
			String gatewayId, 
			String dataSourceType, 
			String connectionDetails, 
			String dataSourceName, 
			String credType, 
			String privacyLevel, 
			String[] credentialsArray,
			GatewayPublicKey pubKey) throws Exception {
		
		// Serialize credentials for encryption
		String serializedCredentials = Utils.serializeCredentials(credentialsArray, credType);
		
		// Encrypt the credentials Asymmetric Key Encryption
		AsymmetricKeyEncryptorService credentialsEncryptor = new AsymmetricKeyEncryptorService(pubKey);
		String encryptedCredentialsString = credentialsEncryptor.encodeCredentials(serializedCredentials);

		// Credential Details class object for request body
		CredentialDetails credentialDetails = new CredentialDetails(credType, encryptedCredentialsString, "Encrypted", privacyLevel);

        PublishDatasourceToGatewayRequest requestBodyObjKey = new PublishDatasourceToGatewayRequest(dataSourceType, connectionDetails, credentialDetails, dataSourceName);
		
		return makeAddDataSourcePostRequest(gatewayId, requestBodyObjKey, accessToken);
	}
	
	// Make an HTTP Post request to add a datasource
	public static ResponseEntity<String> makeAddDataSourcePostRequest(String gatewayId, PublishDatasourceToGatewayRequest requestBody, String accessToken) throws ClientProtocolException, IOException {
		// Gateways - Create Datasource Power BI REST API
		// https://docs.microsoft.com/en-us/rest/api/power-bi/gateways/createdatasource
		String endPointUrl = "https://api.powerbi.com/v1.0/myorg/gateways/" + gatewayId + "/datasources";
		
		// Request header
		HttpHeaders reqHeader = Utils.generateAuthorizationHeaders(accessToken);
		
		// HTTP entity object - holds header and body
		HttpEntity<PublishDatasourceToGatewayRequest> reqEntity = new HttpEntity<PublishDatasourceToGatewayRequest> (requestBody, reqHeader);

		// Rest API get datasources's details
		RestTemplate addDatasource = new RestTemplate();
		return addDatasource.exchange(endPointUrl, HttpMethod.POST, reqEntity, String.class);
	}
}
