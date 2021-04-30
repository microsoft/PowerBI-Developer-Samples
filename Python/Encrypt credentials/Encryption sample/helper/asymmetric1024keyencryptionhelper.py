# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import base64
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from time import sleep


# Refer C# counterpart: 
# https://github.com/microsoft/PowerBI-CSharp/blob/master/sdk/PowerBI.Api/Extensions/Asymmetric1024KeyEncryptionHelper.cs
class Asymmetric1024KeyEncryptionHelper:

    # For modulus size set as 128 bytes with OAEP padding and SHA256 applied, RSA is capable to encrypt messages up to 60 bytes at a time
    SEGMENT_LENGTH = 60
    ENCRYPTED_LENGTH = 128
    MAX_ATTEMPTS = 3

    def encrypt(self, plain_text_bytes, modulus_bytes, exponent_bytes):
        ''' Encrypts the message with RSA, MGF and SHA hashes

        Args:
            plain_text_bytes (bytes): Message to be encrypted
            modulus_bytes (bytes): Modulus bytes returned from GET gateway API
            exponent_bytes (bytes): Exponent bytes returned from GET gateway API

        Returns:
            String: Encrypted credentials
        '''

        # Split the message into different segments, each segment's length is 60. So the result may be 60, 60, 60, ...
        has_incomplete_segment = len(
            plain_text_bytes) % self.SEGMENT_LENGTH != 0

        # Number of segments plain text bytes is sliced into
        segment_number = (len(plain_text_bytes) / self.SEGMENT_LENGTH) if not has_incomplete_segment else (
            (len(plain_text_bytes) / self.SEGMENT_LENGTH) + 1)

        # Convert to integer
        segment_number = int(segment_number)

        # Create a byte array for encrypted bytes
        encrypted_bytes = bytearray(
            [0] * (segment_number * self.ENCRYPTED_LENGTH))

        # For loop to run the encryption
        for i in range(0, segment_number):
            length_to_copy = None
            if i == segment_number - 1 and has_incomplete_segment:
                length_to_copy = len(plain_text_bytes) % self.SEGMENT_LENGTH
            else:
                length_to_copy = self.SEGMENT_LENGTH

            # Initialize segment byte array
            segment = bytearray([0] * length_to_copy)

            # Copy the array from src to dest array
            for k in range(length_to_copy):
                segment[k] = plain_text_bytes[k + (i * self.SEGMENT_LENGTH)]

            # Result of encryption
            segment_encrypted_result = self.encrypt_segment(
                modulus_bytes, exponent_bytes, segment)

            for j in range(0, len(segment_encrypted_result)):
                encrypted_bytes[(i * self.ENCRYPTED_LENGTH) +
                                j] = segment_encrypted_result[j]

        # Returns the decoded string message
        return base64.b64encode(encrypted_bytes).decode()

    def encrypt_segment(self, modulus_bytes, exponent_bytes, data):
        ''' Encrypts the message segment with RSA, MGF and SHA hashes

        Args:
            plain_text_bytes (bytes): Message to be encrypted
            modulus_bytes (bytes): Modulus bytes returned from GET gateway API
            exponent_bytes (bytes): Exponent bytes returned from GET gateway API

        Returns:
            String: Encrypted credentials
        '''

        if not data:
            raise TypeError('Data is null')

        if data == '':
            return data

        # For loop to execute the encryption
        for attempt in range(0, self.MAX_ATTEMPTS):
            try:

                # Convert exponent and modulus byte arrays to integer
                exponent = int.from_bytes(exponent_bytes, 'big')
                modulus = int.from_bytes(modulus_bytes, 'big')

                # Generate public key based on modulus and exponent returned by the API
                public_key = rsa.RSAPublicNumbers(
                    exponent, modulus).public_key(default_backend())

                # Encrypt the data using encrypt method
                # Pass padding algorithm, mask generation function and hashing algorithm
                encrypted_bytes = public_key.encrypt(bytes(data),
                                                     padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()),
                                                                  algorithm=hashes.SHA256(),
                                                                  label=None))

                return encrypted_bytes

            except Exception as ex:
                # Sleep for 50 milliseconds
                sleep(0.05)
                if attempt == self.MAX_ATTEMPTS - 1:
                    raise Exception(ex)

        raise Exception("Invalid Operation")
