# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import requests
from flask import current_app as app

class GetDatasourceService:

    headers = None

    def get_datasources_in_group(self, access_token, group_id, dataset_id):
        ''' Returns all the data sources from the given group

        Args:
            access_token (str): Access token to call API
            group_id (str): Group Id
            dataset_id (str): Dataset Id

        Returns:
            Response: Response from the API call
        '''

        self.headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token}

        # https://docs.microsoft.com/en-us/rest/api/power-bi/datasets/getdatasourcesingroup
        endpoint_url = f'{app.config["POWER_BI_API_URL"]}v1.0/myorg/groups/{group_id}/datasets/{dataset_id}/datasources'

        api_response = requests.get(endpoint_url, headers=self.headers)

        return api_response

    def get_gateway(self, access_token, gateway_id):
        ''' Returns the gateway information

        Args:
            access_token (str): Access token to call API
            gateway_id (str): Gateway Id

        Returns:
            Response: Response from the API call
        '''

        self.headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token}

        endpoint_url = f'{app.config["POWER_BI_API_URL"]}v1.0/myorg/gateways/{gateway_id}'

        api_response = requests.get(endpoint_url, headers=self.headers)

        return api_response
