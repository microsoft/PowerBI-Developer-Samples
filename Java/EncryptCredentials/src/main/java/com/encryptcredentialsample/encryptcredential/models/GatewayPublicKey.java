// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.encryptcredentialsample.encryptcredential.models;

public class GatewayPublicKey {
	public String exponent;
	public String modulus;

	public GatewayPublicKey(String Exponent, String Modulus) {
		exponent = Exponent;
		modulus = Modulus;
	}

	public GatewayPublicKey() {}
}
