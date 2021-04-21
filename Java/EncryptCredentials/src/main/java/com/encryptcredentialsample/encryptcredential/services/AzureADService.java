// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.encryptcredentialsample.encryptcredential.services;

import java.net.MalformedURLException;
import java.util.Collections;
import java.util.concurrent.ExecutionException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.encryptcredentialsample.encryptcredential.config.Config;
import com.microsoft.aad.msal4j.ClientCredentialFactory;
import com.microsoft.aad.msal4j.ClientCredentialParameters;
import com.microsoft.aad.msal4j.ConfidentialClientApplication;
import com.microsoft.aad.msal4j.IAuthenticationResult;
import com.microsoft.aad.msal4j.PublicClientApplication;
import com.microsoft.aad.msal4j.UserNamePasswordParameters;

/**
 * Service to authenticate using MSAL
 */
public final class AzureADService {
	static final Logger logger = LoggerFactory.getLogger(AzureADService.class);
	
	static final String masterUserAuthType = "MasterUser";
	static final String servicePrincipalAuthType = "ServicePrincipal";

	// Prevent instantiation
	private AzureADService() {
		throw new IllegalStateException("Authentication service class");
	}

	/**
	 * Acquires access token for the based on config values
	 * 
	 * @return AccessToken
	 */
	public static String getAccessToken() throws MalformedURLException, InterruptedException, ExecutionException {

		if (Config.authenticationType.equalsIgnoreCase(AzureADService.masterUserAuthType)) {
			return getAccessTokenUsingMasterUser(Config.clientId, Config.pbiUsername, Config.pbiPassword);
		} else if (Config.authenticationType.equalsIgnoreCase(AzureADService.servicePrincipalAuthType)) {
			// Check if Tenant Id is empty
			if (Config.tenantId.isEmpty()) {
				throw new RuntimeException("Tenant Id is empty");
			}

			return getAccessTokenUsingServicePrincipal(Config.clientId, Config.tenantId, Config.clientSecret);
		} else {
			// Authentication Type is none of the above
			throw new RuntimeException("Invalid authentication type: " + Config.authenticationType);
		}
	}

	/**
	 * Acquires access token for the given clientId and app secret
	 * 
	 * @param clientId
	 * @param tenantId
	 * @param appSecret
	 * @return AccessToken
	 */
	private static String getAccessTokenUsingServicePrincipal(String clientId, String tenantId, String appSecret)
			throws MalformedURLException, InterruptedException, ExecutionException {

		// Build Confidential Client App
		ConfidentialClientApplication app = ConfidentialClientApplication
				.builder(clientId, ClientCredentialFactory.createFromSecret(appSecret))
				.authority(Config.authorityUrl + tenantId).build();

		ClientCredentialParameters clientCreds = ClientCredentialParameters
				.builder(Collections.singleton(Config.scopeUrl)).build();

		// Acquire new AAD token
		IAuthenticationResult result = app.acquireToken(clientCreds).get();

		// Return access token if token is acquired successfully
		if (result != null && result.accessToken() != null && !result.accessToken().isEmpty()) {
			if (Config.DEBUG) {
				logger.info("Authenticated with Service Principal mode");
			}

			return result.accessToken();
		} else {
			logger.error("Failed to authenticate with Service Principal mode");
			return null;
		}
	}

	/**
	 * Acquires access token for the given clientId and user credentials
	 * 
	 * @param clientId
	 * @param username
	 * @param password
	 * @return AccessToken
	 */
	private static String getAccessTokenUsingMasterUser(String clientId, String username, String password)
			throws MalformedURLException, InterruptedException, ExecutionException {

		// Build Public Client App
		// Refer: https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-client-application-configuration#authority
		PublicClientApplication app = PublicClientApplication.builder(clientId)
				.authority(Config.authorityUrl + "organizations") // For work and school accounts, refer authority types for other accounts 
				.build();

		UserNamePasswordParameters userCreds = UserNamePasswordParameters
				.builder(Collections.singleton(Config.scopeUrl), username, password.toCharArray()).build();

		// Acquire new AAD token
		IAuthenticationResult result = app.acquireToken(userCreds).get();

		// Return access token if token is acquired successfully
		if (result != null && result.accessToken() != null && !result.accessToken().isEmpty()) {
			if (Config.DEBUG) {
				logger.info("Authenticated with MasterUser mode");
			}

			return result.accessToken();
		} else {
			logger.error("Failed to authenticate with MasterUser mode");
			return null;
		}
	}
}