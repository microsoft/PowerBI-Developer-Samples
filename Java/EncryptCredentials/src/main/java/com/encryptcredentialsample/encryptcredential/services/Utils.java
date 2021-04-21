// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.encryptcredentialsample.encryptcredential.services;

import java.util.Arrays;

import org.springframework.http.HttpHeaders;

public class Utils {
	public static String serializeCredentials(String[] credentialsArray, String credType) throws Exception {
		String serializedCredentials;
		
		// Build credentials string as per docs: https://docs.microsoft.com/en-us/rest/api/power-bi/gateways/updatedatasource#examples
		switch (credType) {
			case "Key":
				serializedCredentials = "{\"credentialData\":[{\"name\":\"key\",\"value\":\"" + credentialsArray[0] + "\"}]}";
				break;

			case "Windows":
				serializedCredentials = "{\"credentialData\":[{\"name\":\"username\",\"value\":\"" + credentialsArray[0] + "\"},{\"name\":\"password\",\"value\":\"" + credentialsArray[1] + "\"}]}";
				break;

			case "OAuth2":
				serializedCredentials = "{\"credentialData\":[{\"name\":\"accessToken\",\"value\":\"" + credentialsArray[0] + "\"}]}";
				break;

			case "Basic":
				serializedCredentials = "{\"credentialData\":[{\"name\":\"username\",\"value\":\"" + credentialsArray[0] + "\"},{\"name\":\"password\",\"value\":\"" + credentialsArray[1] + "\"}]}";
				break;

			default:
				throw new Exception("Invalid credentials type");
		}
		
		return serializedCredentials;
	}
	
	public static HttpHeaders generateAuthorizationHeaders(String accessToken) {
		HttpHeaders reqHeader = new HttpHeaders();
		reqHeader.put("Content-Type", Arrays.asList("application/json"));
		reqHeader.put("Authorization", Arrays.asList("Bearer " + accessToken));
		return reqHeader;
	}
}
