// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.encryptcredentialsample.encryptcredential.services;

import java.util.Arrays;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.embedsample.appownsdata.config.Config;
import com.encryptcredentialsample.encryptcredential.models.Gateway;
import com.encryptcredentialsample.encryptcredential.models.GetDatasourcesResponse;

public class GetDatasourceData {

	public static Gateway getGateway(String accessToken, String getwayId) {

		// REST API URL to get data sources
		String endPointUrl = Config.powerBiApiUrl + "v1.0/myorg/gateways/" + getwayId;

		// Request header
		HttpHeaders reqHeader = new HttpHeaders();
		reqHeader.put("Content-Type", Arrays.asList("application/json"));
		reqHeader.put("Authorization", Arrays.asList("Bearer " + accessToken));

		// HTTP entity object - holds header and body
		HttpEntity<String> reqEntity = new HttpEntity<>(reqHeader);

		// Rest API get datasources's details
		RestTemplate getGatewaysRestTemplate = new RestTemplate();
		ResponseEntity<Gateway> response = getGatewaysRestTemplate.exchange(endPointUrl, HttpMethod.GET, reqEntity, Gateway.class);
		return response.getBody();
	}

	// Get Datasources In Group Power BI REST API
	public static GetDatasourcesResponse getDatasourcesInGroup(String accessToken, String datasetId, String groupId) {

		// Request header
		HttpHeaders reqHeader = new HttpHeaders();
		reqHeader.put("Content-Type", Arrays.asList("application/json"));
		reqHeader.put("Authorization", Arrays.asList("Bearer " + accessToken));

		// HTTP entity object - holds header and body
		HttpEntity<String> reqEntity = new HttpEntity<>(reqHeader);

		// https://docs.microsoft.com/en-us/rest/api/power-bi/datasets/getdatasourcesingroup
		String endPointUrl = Config.powerBiApiUrl + "v1.0/myorg/groups/" + groupId + "/datasets/" + datasetId + "/datasources";

		// Rest API get datasources's details
		RestTemplate getDatasourceRestTemplate = new RestTemplate();
		ResponseEntity<GetDatasourcesResponse> response = getDatasourceRestTemplate.exchange(endPointUrl, HttpMethod.GET, reqEntity, GetDatasourcesResponse.class);

		// HttpHeaders responseHeader = response.getHeaders();
		return response.getBody();
	}
}
