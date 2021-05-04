# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import requests
from flask import json
from models.credentialsdetails import CredentialsDetails
from models.publishdatasourcetogatewayrequest import PublishDatasourceToGatewayRequest
from services.asymmetrickeyencryptor import AsymmetricKeyEncryptor
from utils import Utils


class AddCredentialsService:

    headers = None

    def add_data_source(self, access_token, gateway_id, data_source_type, connection_details, data_source_name, cred_type, privacy_level, credentials_array, public_key):
        ''' Adds data source with encrypted credentials

        Args:
            access_token (str): Access token to call API
            gateway_id (str): Gateway Id
            data_source_type (str): Data source type (i.e. SQL)
            connection_details (str): Connection string for the data source
            data_source_name (str): Name of the data source
            cred_type (str): Type of the credentials (i.e. Basic, Windows, OAuth2)
            privacy_level (str): Privacy level
            credentials_array (dict): Credentials based on the user input of the credentials type
            public_key (PublicKey): Public Key object with modulus and exponent as properties

        Returns:
            Response: Response from the API call
        '''

        # Serialize credentials for encryption
        serialized_credentials = Utils.serialize_credentials(
            credentials_array, cred_type)

        # Encrypt the credentials using Asymmetric Key Encryption
        asymmetric_encryptor_service = AsymmetricKeyEncryptor(public_key)
        encrypted_credentials_string = asymmetric_encryptor_service.encode_credentials(
            serialized_credentials)

        # Credential Details class object for request body
        credentials_details = CredentialsDetails(
            cred_type, encrypted_credentials_string, privacy_level)

        # Add Data source class object for request body
        publish_data_source_request_body = PublishDatasourceToGatewayRequest(
            data_source_type, connection_details, credentials_details.__dict__, data_source_name)

        return self.make_add_datasource_post_request(gateway_id, publish_data_source_request_body, access_token)

    def make_add_datasource_post_request(self, gateway_id, request_body, access_token):
        ''' Makes the API call

        Args:
            gateway_id (str): Gateway Id
            request_body (PublishDatasourceToGatewayRequest): API request body
            access_token (str): Access token to call API

        Returns:
            Response: Response from the API call
        '''

        self.headers = {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + access_token}

        # Gateways - Create Datasource Power BI REST API
        # https://docs.microsoft.com/en-us/rest/api/power-bi/gateways/createdatasource
        endpoint_url = f'https://api.powerbi.com/v1.0/myorg/gateways/{gateway_id}/datasources'

        api_response = requests.post(endpoint_url, data=json.dumps(
            request_body.__dict__), headers=self.headers)

        return api_response
