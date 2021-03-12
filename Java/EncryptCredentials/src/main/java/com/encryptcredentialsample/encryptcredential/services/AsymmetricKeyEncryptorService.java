// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.encryptcredentialsample.encryptcredential.services;

import java.util.Base64;

import com.encryptcredentialsample.encryptcredential.helper.Asymmetric1024KeyEncryptionHelper;
import com.encryptcredentialsample.encryptcredential.helper.AsymmetricHigherKeyEncryptionHelper;
import com.encryptcredentialsample.encryptcredential.models.GatewayPublicKey;

public class AsymmetricKeyEncryptorService {

	private static int MODULUS_SIZE = 128;
	private GatewayPublicKey publicKey;

	public AsymmetricKeyEncryptorService(GatewayPublicKey gatewayPubKey) throws Exception {

		if (gatewayPubKey == null) {
			throw new Exception("publicKey");
		}

		if (gatewayPubKey.exponent == null || (gatewayPubKey.exponent).isEmpty()) {
			throw new Exception("gatewayPubKey.Exponent");
		}

		if (gatewayPubKey.modulus == null || (gatewayPubKey.modulus).isEmpty()) {
			throw new Exception("gatewayPubKey.Modulus");
		}

		this.publicKey = gatewayPubKey;
	}

	// Encrypt the credential data using encryption helpers
	public String encodeCredentials(String credentialData) throws Exception {
		if (credentialData == null || credentialData.isEmpty()) {
			throw new Exception("credentialData");
		}

		byte[] plainTextBytes = credentialData.getBytes("UTF8");
		byte[] modulusBytes = Base64.getDecoder().decode(this.publicKey.modulus);
		byte[] exponentBytes = Base64.getDecoder().decode(this.publicKey.exponent);

		// Call the encryption helper based on the modulus size
		return modulusBytes.length == MODULUS_SIZE
				? Asymmetric1024KeyEncryptionHelper.Encrypt(plainTextBytes, modulusBytes, exponentBytes)
				: AsymmetricHigherKeyEncryptionHelper.Encrypt(plainTextBytes, modulusBytes, exponentBytes);
	}
}
