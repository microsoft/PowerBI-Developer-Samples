# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import base64
import os
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from helper.authenticatedencryption import AuthenticatedEncryption


# Refer C# counterpart:
# https://github.com/microsoft/PowerBI-CSharp/blob/master/sdk/PowerBI.Api/Extensions/AsymmetricHigherKeyEncryptionHelper.cs
class AsymmetricHigherKeyEncryptionHelper:

    KEY_LENGTHS_PREFIX = 2
    HMAC_KEY_SIZE_BYTES = 64
    AES_KEY_SIZE_BYTES = 32

    KEY_LENGTH_32 = 0
    KEY_LENGTH_64 = 1

    def encrypt(self, plain_text_bytes, modulus_bytes, exponent_bytes):
        ''' Encrypts the message with RSA, MGF and SHA hashes

        Args:
            plain_text_bytes (bytes): Message to be encrypted
            modulus_bytes (bytes): Modulus bytes returned from GET gateway API
            exponent_bytes (bytes): Exponent bytes returned from GET gateway API

        Returns:
            String: Encrypted credentials
        '''

        # Generate ephemeral random keys for encryption (32 bytes), hmac (64 bytes)
        key_enc = os.urandom(self.AES_KEY_SIZE_BYTES)
        key_mac = os.urandom(self.HMAC_KEY_SIZE_BYTES)

        authenticated_encryption = AuthenticatedEncryption()

        # Encrypt message using ephemeral keys and Authenticated Encryption
        # Symmetric algorithm and encryptor
        cipher_text = authenticated_encryption.encrypt(
            key_enc, key_mac, plain_text_bytes)

        # Encrypt ephemeral keys using RSA
        keys = bytearray(
            [0] * (len(key_enc) + len(key_mac) + self.KEY_LENGTHS_PREFIX))

        # Prefixing length of Keys. Symmetric Key length followed by HMAC key length
        keys[0] = self.KEY_LENGTH_32
        keys[1] = self.KEY_LENGTH_64

        # Copy key enc and key mac into keys array
        keys[2: len(key_enc) + 2] = key_enc[0: len(key_enc)]
        keys[len(key_enc) + 2: len(key_enc) + len(key_mac) + 2] = key_mac[0: len(key_mac)]

        # Convert exponent and modulus byte arrays to integers
        exponent = int.from_bytes(exponent_bytes, 'big')
        modulus = int.from_bytes(modulus_bytes, 'big')

        # Generate public key based on modulus and exponent returned by the API
        public_key = rsa.RSAPublicNumbers(
            exponent, modulus).public_key(default_backend())

        # Encrypt the data
        # Pass padding algorithm, mask generation function and hashing algorithm
        encrypted_bytes = public_key.encrypt(bytes(keys),
                                             padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()),
                                                          algorithm=hashes.SHA256(),
                                                          label=None))

        # Return final output
        return base64.b64encode(encrypted_bytes).decode() + base64.b64encode(cipher_text).decode()
