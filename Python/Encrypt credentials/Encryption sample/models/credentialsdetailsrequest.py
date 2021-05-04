# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

class CredentialsDetailsRequest:

    # Camel casing is used for the member variables as they are going to be serialized and camel case is standard for JSON keys
    credentialDetails = None

    def __init__(self, credentials_details):
        self.credentialDetails = credentials_details
