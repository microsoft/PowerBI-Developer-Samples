# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import requests
from flask import json
from models.credentialsdetails import CredentialsDetails
from models.credentialsdetailsrequest import CredentialsDetailsRequest
from services.asymmetrickeyencryptor import AsymmetricKeyEncryptor
from utils import Utils


class UpdateCredentialsService:

    headers = None

    def update_datasource(self, access_token, cred_type, privacy_level, credentials_array, gateway, datasource_id):
        ''' Updates data source with encrypted credentials

        Args:
            access_token (str): Access token to call API
            cred_type (str): Type of the credentials (i.e. Basic, Windows, OAuth2)
            privacy_level (str): Privacy level
            credentials_array (dict): Credentials based on the user input of the credentials type
            gateway (Gateway): Gateway response
            datasource_id (str): Data source id to encrpt

        Returns:
            Response: Response from the API call
        '''
        gateway_id = gateway['id']
        public_key = gateway['publicKey']

        # Serialize credentials for encryption
        serialized_credentials = Utils.serialize_credentials(credentials_array, cred_type)

        # On-premises gateway contains name property
        # Use on-premises gateway
        if 'name' in gateway:
            # Encrypt the credentials Asymmetric Key Encryption
            asymmetric_encryptor_service = AsymmetricKeyEncryptor(public_key)
            encrypted_credentials_string = asymmetric_encryptor_service.encode_credentials(serialized_credentials)
            encrypted_data = encrypted_credentials_string
            encrypted_connection = 'Encrypted'

        # Use cloud gateway
        else:
            encrypted_data = serialized_credentials
            encrypted_connection = 'NotEncrypted'

        # Credential Details class object for request body
        credentials_details = CredentialsDetails(cred_type, encrypted_data, encrypted_connection, privacy_level)

        # Converting CredentialDetails class object to json string
        credentials_details_req = CredentialsDetailsRequest(credentials_details.__dict__)

        return self.make_update_datasource_patch_request(credentials_details_req, gateway_id, datasource_id, access_token)

    def make_update_datasource_patch_request(self, credentials_details_req, gateway_id, datasource_id, access_token):
        ''' Makes API call

        Args:
            credentials_details_req (CredentialsDetailsRequest): Credentials update request body
            gateway_id (str): Gateway Id
            datasource_id (str): Data source id to encrpt
            access_token (str): Access token to call API

        Returns:
            Response: Response from the API call
        '''

        self.headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token}

        # Gateways - Update Datasource Power BI REST API
        # https://docs.microsoft.com/en-us/rest/api/power-bi/gateways/updatedatasource
        endpoint_url = f'https://api.powerbi.com/v1.0/myorg/gateways/{gateway_id}/datasources/{datasource_id}'

        api_response = requests.patch(endpoint_url, data=json.dumps(credentials_details_req.__dict__), headers=self.headers)

        return api_response
