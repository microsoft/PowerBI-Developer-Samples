# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license

class EmbedTokenRequestBody:

    # Camel casing is used for the member variables as they are going to be serialized and camel case is standard for JSON keys

    datasets = None
    reports = None
    targetWorkspaces = None
    identities = None

    def __init__(self):
        self.datasets = []
        self.reports = []
        self.targetWorkspaces = []