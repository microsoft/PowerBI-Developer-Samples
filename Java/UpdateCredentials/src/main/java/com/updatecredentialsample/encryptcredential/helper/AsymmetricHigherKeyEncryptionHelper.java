// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.updatecredentialsample.encryptcredential.helper;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.spec.MGF1ParameterSpec;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.OAEPParameterSpec;
import javax.crypto.spec.PSource;

// Refer C# counterpart: 
// https://github.com/microsoft/PowerBI-CSharp/blob/master/sdk/PowerBI.Api/Extensions/AsymmetricHigherKeyEncryptionHelper.cs
public class AsymmetricHigherKeyEncryptionHelper {
	private static byte KeyLength32 = 0;
	private static byte KeyLength64 = 1;

	private static int KEY_LENGTHS_PREFIX = 2;
	private static int MIN_HMAC_KEY_SIZE_BYTES = 32;
	private static int HMAC_KEY_SIZE_BYTES = 64;
	private static int AES_KEY_SIZE_BYTES = 32;

	private static final String TRANSFORMATION = "RSA/ECB/OAEPPadding";
	private static final String ALGORITHM = "RSA";
	private static final String MESSAGE_DIGEST = "SHA-256";
	private static final String MASK_GENERATION_FUNCTION = "MGF1";

	public static String Encrypt(byte[] plainTextBytes, byte[] modulusBytes, byte[] exponentBytes) throws Exception {

		// Generate ephemeral keys for encryption (32 bytes), hmac (64 bytes)
		byte[] keyEnc = GetRandomBytes(AES_KEY_SIZE_BYTES);
		byte[] keyMac = GetRandomBytes(HMAC_KEY_SIZE_BYTES);

		// Encrypt message using ephemeral keys and Authenticated Encryption
		// Symmetric algorithm and encryptor
		byte[] cipherText = AuthenticatedEncryption.Encrypt(keyEnc, keyMac, plainTextBytes);

		// Encrypt ephemeral keys using RSA
		byte[] keys = new byte[KEY_LENGTHS_PREFIX + keyEnc.length + keyMac.length];

		// Prefixing length of Keys. Symmetric Key length followed by HMAC key length
		keys[0] = (byte) KeyLength32;
		keys[1] = (byte) KeyLength64;

		System.arraycopy(keyEnc, 0, keys, 2, keyEnc.length);
		System.arraycopy(keyMac, 0, keys, keyEnc.length + 2, keyMac.length);

		BigInteger modulus = new BigInteger(1, modulusBytes);
		BigInteger exponent = new BigInteger(1, exponentBytes);

		RSAPublicKeySpec keySpec = new RSAPublicKeySpec(modulus, exponent);
		KeyFactory fact = KeyFactory.getInstance(ALGORITHM);
		PublicKey pubKey = fact.generatePublic(keySpec);

		Cipher cipherKey = Cipher.getInstance(TRANSFORMATION);

		OAEPParameterSpec oaepParams = new OAEPParameterSpec(MESSAGE_DIGEST, MASK_GENERATION_FUNCTION, new MGF1ParameterSpec(MESSAGE_DIGEST),
				PSource.PSpecified.DEFAULT);
		cipherKey.init(Cipher.ENCRYPT_MODE, pubKey, oaepParams);

		byte[] encryptedKeys = cipherKey.doFinal(keys);

		// Prepare final payload
		return Base64.getEncoder().encodeToString(encryptedKeys) + Base64.getEncoder().encodeToString(cipherText);
	}

	private static byte[] GetRandomBytes(int size) {

		byte[] data = new byte[size];
		SecureRandom random = new SecureRandom();
		random.nextBytes(data);
		return data;
	}
}
