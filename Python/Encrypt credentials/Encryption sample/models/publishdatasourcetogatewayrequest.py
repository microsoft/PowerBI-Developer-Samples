# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

class PublishDatasourceToGatewayRequest:

    # Camel casing is used for the member variables as they are going to be serialized and camel case is standard for JSON keys
    dataSourceType = None
    connectionDetails = None
    credentialDetails = None
    datasourceName = None

    def __init__(self, data_source_type, connection_details, credentials_details, data_source_name):
        self.dataSourceType = data_source_type
        self.connectionDetails = connection_details
        self.credentialDetails = credentials_details
        self.datasourceName = data_source_name
