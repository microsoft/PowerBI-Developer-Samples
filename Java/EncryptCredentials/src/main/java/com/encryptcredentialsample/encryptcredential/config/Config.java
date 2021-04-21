// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.encryptcredentialsample.encryptcredential.config;

/**
 * Configuration class
 */
public abstract class Config {

	// Set this to true, to show debug statements in console
	public static final boolean DEBUG = false;

	// Two possible Authentication methods:
	// - For authentication with master user credential choose MasterUser as
	// AuthenticationType.
	// - For authentication with app secret choose ServicePrincipal as
	// AuthenticationType.
	// More details here: https://aka.ms/EmbedServicePrincipal
	public static final String authenticationType = "ServicePrincipal";

	// Common configuration properties for both authentication types
	// Enter Application Id
	public static final String clientId = "";

	// Enter MasterUser credentials
	public static final String pbiUsername = "";
	public static final String pbiPassword = "";

	// Enter ServicePrincipal credentials
	public static final String tenantId = "";
	public static final String clientSecret = "";

	// DO NOT CHANGE
	public static final String authorityUrl = "https://login.microsoftonline.com/";
	public static final String scopeUrl = "https://analysis.windows.net/powerbi/api/.default";

	private Config() {
		// Private Constructor will prevent the instantiation of this class directly
		throw new IllegalStateException("Config class");
	}
}