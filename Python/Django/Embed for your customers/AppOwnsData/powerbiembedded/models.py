import msal
import requests
import json
from Django.config import BaseConfig


class AzureADAuthService:
    def __init__(self):
        self.client_app = None

    def get_client_application(self):
        if self.client_app is None:
            if BaseConfig.AUTHENTICATION_MODE.lower() == 'masteruser':
                self.client_app = msal.PublicClientApplication(
                    BaseConfig.CLIENT_ID, authority=BaseConfig.AUTHORITY_URL
                )
            elif BaseConfig.AUTHENTICATION_MODE.lower() == 'serviceprincipal':
                authority = BaseConfig.AUTHORITY_URL.replace('organizations', BaseConfig.TENANT_ID)
                self.client_app = msal.ConfidentialClientApplication(
                    BaseConfig.CLIENT_ID, client_credential=BaseConfig.CLIENT_SECRET, authority=authority
                )
        return self.client_app

    def get_access_token(self):
        client_app = self.get_client_application()
        accounts = client_app.get_accounts(username=BaseConfig.POWER_BI_USER)

        response = client_app.acquire_token_silent(BaseConfig.SCOPE_BASE, account=accounts[0]) if accounts else None

        if not response:
            response = client_app.acquire_token_by_username_password(
                BaseConfig.POWER_BI_USER, BaseConfig.POWER_BI_PASS, scopes=BaseConfig.SCOPE_BASE
            )

        try:
            return response['access_token']
        except KeyError:
            raise Exception(response['error_description'])


class PowerBIEmbedService:
    def __init__(self):
        self.auth_service = AzureADAuthService()

    def get_embed_params_for_report(self, workspace_id, report_id, additional_dataset_id=None):
        report_url = f'https://api.powerbi.com/v1.0/myorg/groups/{workspace_id}/reports/{report_id}'
        api_response = requests.get(report_url, headers=self.get_request_header())

        if api_response.status_code != 200:
            error_message = {'error': f'Request failed with status code {api_response.status_code}'}
            return json.dumps(error_message)

        api_response = api_response.json()
        report = {
            'reportId': api_response['id'],
            'reportName': api_response['name'],
            'embedUrl': api_response['embedUrl'],
            'datasetId': api_response['datasetId']
        }

        dataset_ids = [api_response['datasetId']]
        if additional_dataset_id is not None:
            dataset_ids.append(additional_dataset_id)

        embed_token = self.get_embed_token_for_report(workspace_id, report_id, dataset_ids)
        embed_config = {
            'tokenId': embed_token['tokenId'],
            'accessToken': embed_token['token'],
            'tokenExpiry': embed_token['tokenExpiry'],
            'reportConfig': [report]
        }

        return json.dumps(embed_config)

    def get_request_header(self):
        access_token = self.auth_service.get_access_token()
        return {'Content-Type': 'application/json', 'Authorization': f'Bearer {access_token}'}

    def get_embed_token_for_report(self, workspace_id, report_id, dataset_ids):
        request_body = {
            'datasets': [{'id': dataset_id} for dataset_id in dataset_ids],
            'reports': [{'id': report_id}],
            'targetWorkspaces': [{'id': workspace_id}]
        }

        embed_token_api = 'https://api.powerbi.com/v1.0/myorg/GenerateToken'
        api_response = requests.post(
            embed_token_api, json=request_body, headers=self.get_request_header()
        )

        if api_response.status_code != 200:
            error_message = {
                'error': f'Error while retrieving Embed token\n{api_response.reason}:\t{api_response.text}\nRequestId:\t{api_response.headers.get("RequestId")}'
            }
            return json.dumps(error_message)

        api_response = api_response.json()
        embed_token = {
            'tokenId': api_response['tokenId'],
            'token': api_response['token'],
            'tokenExpiry': api_response['expiration']
        }

        return embed_token
