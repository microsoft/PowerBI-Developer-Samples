// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.updatecredentialsample.encryptcredential.helper;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.spec.IvParameterSpec;

// Refer C# counterpart:
// https://github.com/microsoft/PowerBI-CSharp/blob/master/sdk/PowerBI.Api/Extensions/AuthenticatedEncryption.cs
public class AuthenticatedEncryption {

	private static byte Aes256CbcPkcs7 = (byte) 0;
	private static byte HMACSHA256 = (byte) 0;

	private static byte[] algorithmChoices = { Aes256CbcPkcs7, HMACSHA256 };

	public static byte[] Encrypt(byte[] keyEnc, byte[] keyMac, byte[] message) throws Exception {
		if (keyEnc.length < 32)
			throw new Exception("Encryption Key must be at least 256 bits (32 bytes)");
		if (keyMac.length < 32)
			throw new Exception("Mac Key must be at least 256 bits (32 bytes)");
		if (message == null)
			throw new Exception("Credentials cannot be null");

		byte[] iv;
		byte[] cipherText;
		byte[] tagData;
		byte[] tag;
		byte[] output;

		SecretKeySpec key = new SecretKeySpec(keyEnc, "AES");
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		cipher.init(Cipher.ENCRYPT_MODE, key);
		iv = cipher.getIV();
		cipherText = cipher.doFinal(message);

		// The IV and ciphertest both need to be included in the MAC to prevent
		// tampering.
		//
		// By including the algorithm identifiers, we have technically moved from
		// simple Authenticated Encryption (AE) to Authenticated Encryption with
		// Additional Data (AEAD). By including the algorithm identifiers in the
		// MAC, it becomes harder for an attacker to change them as an attempt to
		// perform a downgrade attack.

		tagData = new byte[algorithmChoices.length + iv.length + cipherText.length];
		int tagDataOffset = 0;

		System.arraycopy(algorithmChoices, 0, tagData, tagDataOffset, algorithmChoices.length);
		tagDataOffset = algorithmChoices.length + tagDataOffset;

		System.arraycopy(iv, 0, tagData, tagDataOffset, iv.length);
		tagDataOffset = iv.length + tagDataOffset;

		System.arraycopy(cipherText, 0, tagData, tagDataOffset, cipherText.length);
		tagDataOffset = cipherText.length + tagDataOffset;

		SecretKeySpec secretKeySpec = new SecretKeySpec(keyMac, "HmacSHA256");
		Mac tagGenerator = Mac.getInstance("HmacSHA256");
		tagGenerator.init(secretKeySpec);

		tagGenerator.update(tagData, 0, tagData.length);
		tag = tagGenerator.doFinal();
		tagGenerator.reset();

		// Build the final result as the concatenation of everything except the keys.
		output = new byte[algorithmChoices.length + tag.length + iv.length + cipherText.length];
		int outputOffset = 0;

		System.arraycopy(algorithmChoices, 0, output, outputOffset, algorithmChoices.length);
		outputOffset = algorithmChoices.length + outputOffset;

		System.arraycopy(tag, 0, output, outputOffset, tag.length);
		outputOffset = tag.length + outputOffset;

		System.arraycopy(iv, 0, output, outputOffset, iv.length);
		outputOffset = iv.length + outputOffset;

		System.arraycopy(cipherText, 0, output, outputOffset, cipherText.length);
		outputOffset = cipherText.length + outputOffset;

		return output;
	}
}
