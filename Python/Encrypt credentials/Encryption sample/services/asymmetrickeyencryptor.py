# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import base64
from helper.asymmetric1024keyencryptionhelper import Asymmetric1024KeyEncryptionHelper
from helper.asymmetrichigherkeyencryptionhelper import AsymmetricHigherKeyEncryptionHelper


class AsymmetricKeyEncryptor:

    MODULUS_SIZE = 128
    public_key = None

    def __init__(self, public_key):
        if not public_key:
            raise TypeError('public_key')

        if not public_key['exponent'] or public_key['exponent'] == '':
            raise TypeError("public_key['exponent']")

        if not public_key['modulus'] or public_key['modulus'] == '':
            raise TypeError("public_key['modulus']")

        self.public_key = public_key

    def encode_credentials(self, credentails_data):
        ''' Encodes the credentials based on modulus size

        Args:
            credentails_data (str): Credentials data to get encrypted

        Returns:
            String: Encrypted credentials
        '''

        if not credentails_data or credentails_data == '':
            raise TypeError('credentials data')

        plain_text_bytes = bytes(credentails_data, 'utf-8')

        # Convert strings to bytes object
        modulus_bytes = base64.b64decode(self.public_key['modulus'])
        exponent_bytes = base64.b64decode(self.public_key['exponent'])

        # Call the encryption helper based on the modulus size
        asymmetric_1024_key_encryptor_helper = Asymmetric1024KeyEncryptionHelper()
        asymmetric_higher_key_encryptor_helper = AsymmetricHigherKeyEncryptionHelper()

        if len(modulus_bytes) == self.MODULUS_SIZE:
            return asymmetric_1024_key_encryptor_helper.encrypt(plain_text_bytes, modulus_bytes, exponent_bytes)
        else:
            return asymmetric_higher_key_encryptor_helper.encrypt(plain_text_bytes, modulus_bytes, exponent_bytes)
