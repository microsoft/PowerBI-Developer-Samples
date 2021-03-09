// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.updatecredentialsample.encryptcredential.helper;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;

import javax.crypto.Cipher;

public class Asymmetric1024KeyEncryptionHelper {
	private static int SegmentLength = 85;
	private static int EncryptedLength = 128;
	private static int maxAttempts = 3;

	private static final String TRANSFORMATION = "RSA/ECB/OAEPPadding";
	private static final String ALGORITHM = "RSA";

	public static String Encrypt(byte[] plainTextBytes, byte[] modulusBytes, byte[] exponentBytes) throws Exception {

		// Split the message into different segments, each segment's length is 85. So the result can be like 85,85,85,20.
		boolean hasIncompleteSegment = plainTextBytes.length % SegmentLength != 0;

		// Number of segments plainTextBytes is sliced into
		int segmentNumber = (!hasIncompleteSegment) ? (plainTextBytes.length / SegmentLength)
				: ((plainTextBytes.length / SegmentLength) + 1);

		byte[] encryptedBytes = new byte[segmentNumber * EncryptedLength];

		for (int i = 0; i < segmentNumber; i++) {
			int lengthToCopy;

			if (i == segmentNumber - 1 && hasIncompleteSegment) {
				lengthToCopy = plainTextBytes.length % SegmentLength;
			} else {
				lengthToCopy = SegmentLength;
			}

			byte[] segment = new byte[lengthToCopy];

			System.arraycopy(plainTextBytes, i * SegmentLength, segment, 0, lengthToCopy);

			byte[] segmentEncryptedResult = EncryptSegment(modulusBytes, exponentBytes, segment);

			for (int j = 0; j < segmentEncryptedResult.length; j++) {
				encryptedBytes[(i * EncryptedLength) + j] = segmentEncryptedResult[j];
			}
		}
		return Base64.getEncoder().encodeToString(encryptedBytes);
	}

	private static byte[] EncryptSegment(byte[] modulusBytes, byte[] exponentBytes, byte[] data) throws Exception {

		if (data == null) {
			throw new Exception("data is null");
		}

		if (data.length == 0) {
			return data;
		}

		for (int attempt = 0; attempt < maxAttempts; ++attempt) {
			try {
				BigInteger modulus = new BigInteger(1, modulusBytes);
				BigInteger exponent = new BigInteger(1, exponentBytes);

				RSAPublicKeySpec rsaPubKey = new RSAPublicKeySpec(modulus, exponent);
				KeyFactory fact = KeyFactory.getInstance(ALGORITHM);
				PublicKey pubKey = fact.generatePublic(rsaPubKey);

				Cipher cipher = Cipher.getInstance(TRANSFORMATION);
				cipher.init(Cipher.ENCRYPT_MODE, pubKey);

				byte[] cipherData = cipher.doFinal(data);
				return cipherData;

			} catch (Exception ex) {
				Thread.sleep(50);
				if (attempt == maxAttempts - 1) {
					throw ex;
				}
			}
		}
		throw new Exception("Invalid Operation");
	}
}
