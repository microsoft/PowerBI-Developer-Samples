# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import os
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, hmac, padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes


# Refer C# counterpart:
# https://github.com/microsoft/PowerBI-CSharp/blob/master/sdk/PowerBI.Api/Extensions/AuthenticatedEncryption.cs
class AuthenticatedEncryption:

    Aes256CbcPkcs7 = 0
    HMACSHA256 = 0

    algorithm_choices = [Aes256CbcPkcs7, HMACSHA256]

    def encrypt(self, key_enc, key_mac, message):
        ''' Encrypts the message with AES, CBC padding and PKCS7

        Args:
            key_enc (bytes): Encryption Key
            key_mac (bytes): MAC Key
            message (bytes): message to get encrypted

        Returns:
            String: Encrypted credentials
        '''

        if len(key_enc) < 32:
            raise ValueError(
                'Encryption Key must be at least 256 bits (32 bytes)')

        if len(key_mac) < 32:
            raise ValueError('Mac Key must be at least 256 bits (32 bytes)')

        if not message:
            raise TypeError('Credentials cannot be null')

        # Initialization vector
        iv = os.urandom(16)

        # PKC7 Padding
        padder = padding.PKCS7(algorithms.AES.block_size).padder()

        # Apply padding to the test data
        padded_data = padder.update(message) + padder.finalize()

        # Cipher object with CBC mode
        cipher = Cipher(algorithms.AES(key_enc), modes.CBC(iv),
                        backend=default_backend())
        encryptor = cipher.encryptor()

        # Cipher text
        cipher_text = encryptor.update(padded_data) + encryptor.finalize()

        # The IV and ciphertest both need to be included in the MAC to prevent
        # tampering.

        # By including the algorithm identifiers, we have technically moved from
        # simple Authenticated Encryption (AE) to Authenticated Encryption with
        # Additional Data (AEAD). By including the algorithm identifiers in the
        # MAC, it becomes harder for an attacker to change them as an attempt to
        # perform a downgrade attack.

        # Prepare the data on which MAC will be executed
        tag_data = bytearray(
            [0] * (len(self.algorithm_choices) + len(iv) + len(cipher_text)))
        tag_data_offset = 0

        # Copy algorithm choices array in tag_data
        tag_data[0:len(self.algorithm_choices)
                 ] = self.algorithm_choices[0:len(self.algorithm_choices)]
        tag_data_offset = len(self.algorithm_choices) + tag_data_offset

        # Copy initialization vector in tag_data
        tag_data[tag_data_offset:len(iv) + tag_data_offset] = iv[0:len(iv)]
        tag_data_offset = len(iv) + tag_data_offset

        # Copy cipher text vector in tag_data
        tag_data[tag_data_offset:len(
            cipher_text) + tag_data_offset] = cipher_text[0:len(cipher_text)]
        tag_data_offset = len(cipher_text) + tag_data_offset

        # Pass random generated key and hash algorithm to calculate authentication code
        hmac_instance = hmac.HMAC(
            key_mac, hashes.SHA256(), backend=default_backend())

        # Pass the bytes to hash and authenticate
        hmac_instance.update(tag_data)

        # Finalize the current context and return the message digest as bytes
        mac = hmac_instance.finalize()

        # Build the final result as the concatenation of everything except the keys
        output = bytearray(
            [0] * (len(self.algorithm_choices) + len(mac) + len(iv) + len(cipher_text)))
        output_offset = 0

        output[0: len(self.algorithm_choices)] = self.algorithm_choices[0:len(self.algorithm_choices)]
        output_offset = len(self.algorithm_choices) + output_offset

        output[output_offset:len(mac) + output_offset] = mac[0:len(mac)]
        output_offset = len(mac) + output_offset

        output[output_offset:len(iv) + output_offset] = iv[0:len(iv)]
        output_offset = len(iv) + output_offset

        output[output_offset:len(cipher_text) + output_offset] = cipher_text[0:len(cipher_text)]
        output_offset = len(cipher_text) + output_offset

        return output
