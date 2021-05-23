# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

class CredentialsDetails:
    ENCRYPTION_ALGORITHM = 'RSA-OAEP'

    # Camel casing is used for the member variables as they are going to be serialized and camel case is standard for JSON keys
    credentialType = None
    credentials = None
    encryptedConnection = None
    privacyLevel = None

    def __init__(self, cred_type, serialized_credentials, encrypted_connection, privacy_level):
        self.credentialType = cred_type
        self.credentials = serialized_credentials
        self.encryptedConnection = encrypted_connection
        self.encryptionAlgorithm = CredentialsDetails.ENCRYPTION_ALGORITHM
        self.privacyLevel = privacy_level
