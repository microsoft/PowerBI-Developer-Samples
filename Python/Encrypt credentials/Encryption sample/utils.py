# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

cred_types = {
    'KEY': 'Key',
    'WINDOWS': 'Windows',
    'OAUTH2': 'OAuth2',
    'BASIC': 'Basic'
}


class Utils:

    def validate_config(app):
        ''' Returns a message to user for missing configuration

        Args:
            app (Flask): Flask app object

        Returns:
            string: Error info
        '''

        authenticate_mode = app.config['AUTHENTICATION_MODE']
        tenant_id = app.config['TENANT_ID']
        client_id = app.config['CLIENT_ID']
        username = app.config['POWER_BI_USER']
        password = app.config['POWER_BI_PASS']
        client_secret = app.config['CLIENT_SECRET']
        scope = app.config['SCOPE_BASE']
        authority = app.config['AUTHORITY_URL']
        
        if authenticate_mode == '':
            return 'Please specify one of the two authentication modes in config.py file'
        if authenticate_mode.lower() != 'masteruser' and authenticate_mode.lower() != 'serviceprincipal':
            return 'Please specify one of the two authentication modes [serviceprincipal or masteruser] in config.py file'
        if authenticate_mode.lower() == 'serviceprincipal' and tenant_id == '':
            return 'Tenant ID is not provided in config.py file'
        if client_id == '':
            return 'Client ID is not provided in config.py file'
        if authenticate_mode.lower() == 'masteruser':
            if username == '':
                return 'Master account username is not provided in config.py file'
            elif password == '':
                return 'Master account password is not provided in config.py file'
        if authenticate_mode.lower() == 'serviceprincipal' and client_secret == '':
            return 'Client secret is not provided in config.py file'
        if scope == '':
            return 'Scope base is not provided in config.py file'
        if authority == '':
            return 'Authority URL is not provided in config.py file'

    def serialize_credentials(credentials_arr, cred_type):
        ''' Returns serialized credentials

        Args:
            credentials_arr (dict): Credentials based on the user input of the credentials type
            cred_type (string): Credentials type (i.e. Basic, Windows)

        Returns:
            string: Serialized credentials
        '''

        serialized_credentials = ''

        if cred_type == cred_types['KEY']:
            serialized_credentials = '{\'credentialData\':[{\'name\':\'key\',\'value\':\'' + credentials_arr[0] + '\'}]}'

        elif cred_type == cred_types['WINDOWS']:
            serialized_credentials = '{\'credentialData\':[{\'name\':\'username\',\'value\':\'' + \
                credentials_arr[0] + '\'},{\'name\':\'password\',\'value\':\'' + \
                credentials_arr[1] + '\'}]}'

        elif cred_type == cred_types['OAUTH2']:
            serialized_credentials = '{\'credentialData\':[{\'name\':\'accessToken\',\'value\':\'' + credentials_arr[0] + '\'}]}'

        elif cred_type == cred_types['BASIC']:
            serialized_credentials = '{\'credentialData\':[{\'name\':\'username\',\'value\':\'' + \
                credentials_arr[0] + '\'},{\'name\':\'password\',\'value\':\'' + \
                credentials_arr[1] + '\'}]}'

        else:
            raise Exception('Invalid credentials type')

        return serialized_credentials
