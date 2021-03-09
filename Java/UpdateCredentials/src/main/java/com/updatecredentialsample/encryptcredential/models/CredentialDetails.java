// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.updatecredentialsample.encryptcredential.models;

public class CredentialDetails {

	public String credentialType;

	public String credentials;

	public String encryptedConnection;

	public String encryptionAlgorithm;

	public String privacyLevel;

	public CredentialDetails(String credentialType, String serializedCredentials, String privacyLevel) {
		this.credentialType = credentialType;
		this.credentials = serializedCredentials;
		this.encryptedConnection = "Encrypted";
		this.encryptionAlgorithm = "RSA-OAEP";
		this.privacyLevel = privacyLevel;
	}
}
