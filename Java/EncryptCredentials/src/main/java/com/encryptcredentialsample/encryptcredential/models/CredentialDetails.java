// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.encryptcredentialsample.encryptcredential.models;

public class CredentialDetails {

	public String credentialType;

	public String credentials;

	public String encryptedConnection;

	public String encryptionAlgorithm;

	public String privacyLevel;

	public CredentialDetails(String credentialType, String serializedCredentials, String encryptedConnection, String privacyLevel) {
		this.credentialType = credentialType;
		this.credentials = serializedCredentials;
		this.encryptedConnection = encryptedConnection;
		this.encryptionAlgorithm = "RSA-OAEP";
		this.privacyLevel = privacyLevel;
	}
}
