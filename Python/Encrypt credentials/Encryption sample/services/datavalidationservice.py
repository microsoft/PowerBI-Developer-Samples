# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.


class DataValidationService:

    def validate_creds(self, data):
        ''' Validates data for all the functionalities

        Args:
            data (dict): data
        '''
        cred_type = data['credType']

        if not data['credentialsArray'][0] or data['credentialsArray'][0] == '':
            raise KeyError('Credentials data')

        if (cred_type == 'Basic' or cred_type == 'Windows') and (not data['credentialsArray'][1] or data['credentialsArray'][1] == ''):
            raise KeyError('Credentials data')


    def validate_encrypt_data(self, data):
        ''' Validates data for Encrypt credentials functionality

        Args:
            data (dict): data
        '''
        gateway_id = data['gatewayId']
        
        if not gateway_id or gateway_id == '':
            raise KeyError('Gateway ID')
        else:
            self.validate_creds(data)

    def validate_add_data_source(self, data):
        ''' Validates data for Add data source functionality

        Args:
            data (dict): data
        '''
        gateway_id = data['gatewayId']
        data_source_type = data['dataSourceType']
        data_source_name = data['dataSourceName']
        connection_details = data['connectionDetails']

        if not gateway_id or gateway_id == '':
            raise KeyError('Gateway ID')
        elif not data_source_type or data_source_type == '':
            raise KeyError('Data source type')
        elif not data_source_name or data_source_name == '':
            raise KeyError('Data source name')
        elif not connection_details or connection_details == '':
            raise KeyError('Connection details')
        else:
            self.validate_creds(data)
