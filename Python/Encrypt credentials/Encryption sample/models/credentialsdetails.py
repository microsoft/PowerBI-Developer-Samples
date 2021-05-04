# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

class CredentialsDetails:
    ENCRYPTED_CONNECTION = 'Encrypted'
    ENCRYPTION_ALGORITHM = 'RSA-OAEP'

    # Camel casing is used for the member variables as they are going to be serialized and camel case is standard for JSON keys
    credentialType = None
    credentials = None
    privacyLevel = None

    def __init__(self, cred_type, serialized_credentials, privacy_level):
        self.credentialType = cred_type
        self.credentials = serialized_credentials
        self.encryptedConnection = CredentialsDetails.ENCRYPTED_CONNECTION
        self.encryptionAlgorithm = CredentialsDetails.ENCRYPTION_ALGORITHM
        self.privacyLevel = privacy_level
