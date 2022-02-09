# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

class Utils:

    def check_config(app):
        '''Returns a message to user for missing configuration

        Args:
            app (Flask): Flask app object

        Returns:
            string: Error info
        '''

        if app.config['AUTHENTICATION_MODE'] == '':
            return 'Please specify one of the two authentication modes'
        if app.config['AUTHENTICATION_MODE'].lower() == 'serviceprincipal' and app.config['TENANT_ID'] == '':
            return 'Tenant ID is not provided in the config.py file'
        elif app.config['REPORT_ID'] == '':
            return 'Report ID is not provided in config.py file'
        elif app.config['WORKSPACE_ID'] == '':
            return 'Workspace ID is not provided in config.py file'
        elif app.config['CLIENT_ID'] == '':
            return 'Client ID is not provided in config.py file'
        elif app.config['AUTHENTICATION_MODE'].lower() == 'masteruser':
            if app.config['POWER_BI_USER'] == '':
                return 'Master account username is not provided in config.py file'
            elif app.config['POWER_BI_PASS'] == '':
                return 'Master account password is not provided in config.py file'
        elif app.config['AUTHENTICATION_MODE'].lower() == 'serviceprincipal':
            if app.config['CLIENT_SECRET'] == '':
                return 'Client secret is not provided in config.py file'
        elif app.config['SCOPE_BASE'] == '':
            return 'Scope base is not provided in the config.py file'
        elif app.config['AUTHORITY_URL'] == '':
            return 'Authority URL is not provided in the config.py file'
        
        return None