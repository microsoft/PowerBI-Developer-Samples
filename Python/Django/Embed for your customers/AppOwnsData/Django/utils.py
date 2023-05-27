# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

class Utils:

    def check_config(app):
        '''Returns a message to user for missing configuration

        Args:
            app (Django): Django app object

        Returns:
            string: Error info
        '''

        if app.AUTHENTICATION_MODE == '':
            return 'Please specify one of the two authentication modes'
        if app.AUTHENTICATION_MODE.lower() == 'serviceprincipal' and app.config['TENANT_ID'] == '':
            return 'Tenant ID is not provided in the config.py file'
        elif app.REPORT_ID == '':
            return 'Report ID is not provided in config.py file'
        elif app.WORKSPACE_ID == '':
            return 'Workspace ID is not provided in config.py file'
        elif app.CLIENT_ID == '':
            return 'Client ID is not provided in config.py file'
        elif app.AUTHENTICATION_MODE.lower() == 'masteruser':
            if app.POWER_BI_USER == '':
                return 'Master account username is not provided in config.py file'
            elif app.POWER_BI_PASS == '':
                return 'Master account password is not provided in config.py file'
        elif app.AUTHENTICATION_MODE.lower() == 'serviceprincipal':
            if app.CLIENT_SECRET == '':
                return 'Client secret is not provided in config.py file'
        elif app.SCOPE_BASE == '':
            return 'Scope base is not provided in the config.py file'
        elif app.AUTHORITY_URL == '':
            return 'Authority URL is not provided in the config.py file'

        return None