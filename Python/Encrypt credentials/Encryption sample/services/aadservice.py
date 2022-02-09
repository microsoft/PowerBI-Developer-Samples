# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import msal
from flask import current_app as app
from utils import Utils


class AadService:

    def get_access_token():
        ''' Generates and returns Access token

        Returns:
            string: Access token
        '''

        config_result = Utils.validate_config(app)
        if config_result:
            raise Exception(config_result)

        authenticate_mode = app.config['AUTHENTICATION_MODE']
        tenant_id = app.config['TENANT_ID']
        client_id = app.config['CLIENT_ID']
        username = app.config['POWER_BI_USER']
        password = app.config['POWER_BI_PASS']
        client_secret = app.config['CLIENT_SECRET']
        scope = app.config['SCOPE_BASE']
        authority = app.config['AUTHORITY_URL']
        response = None

        try:
            if authenticate_mode.lower() == 'masteruser':

                # Create a public client to authorize the app with the AAD app
                clientapp = msal.PublicClientApplication(client_id, authority=authority)

                # Make a client call if Access token is not available in cache
                response = clientapp.acquire_token_by_username_password(username, password, scopes=scope)

            # Service Principal auth is recommended by Microsoft to achieve App Owns Data Power BI embedding
            else:
                authority = authority.replace('organizations', tenant_id)
                clientapp = msal.ConfidentialClientApplication(client_id, client_credential=client_secret, authority=authority)

                # Make a client call if Access token is not available in cache
                response = clientapp.acquire_token_for_client(scopes=scope)

            return response['access_token']

        except KeyError:
            raise Exception(response['error_description'])
        except Exception as ex:
            raise Exception('Error retrieving Access token\n' + str(ex))
