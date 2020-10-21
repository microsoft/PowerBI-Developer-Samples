# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license

class EmbedToken:

    # Camel casing is used for the member variables as they are going to be serialized and camel case is standard for JSON keys

    tokenId = None
    token = None
    tokenExpiry = None

    def __init__(self, token_id, token, token_expiry):
        self.tokenId = token_id
        self.token = token
        self.tokenExpiry = token_expiry