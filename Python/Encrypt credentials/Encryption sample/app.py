# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

from flask import Flask, json, render_template, request, Response, json
from services.aadservice import AadService
from services.addcredentialsservice import AddCredentialsService
from services.asymmetrickeyencryptor import AsymmetricKeyEncryptor
from services.datavalidationservice import DataValidationService
from services.getdatasource import GetDatasourceService
from services.updatecredentialsservice import UpdateCredentialsService
from utils import Utils
import requests

# Initialize the Flask app
app = Flask(__name__)

# Load configuration
app.config.from_object('config.BaseConfig')


@app.route('/')
def index():
    '''Returns a static HTML page'''

    return render_template('index.html')


@app.route('/encryptcredential/getdatasourcesingroup', methods=['GET'])
def get_datasources_in_group():
    ''' Returns data sources based on datasetId and groupId '''

    group_id = request.args.get('groupId')
    dataset_id = request.args.get('datasetId')

    try:
        access_token = AadService.get_access_token()

        data_source_service = GetDatasourceService()
        api_response = data_source_service.get_datasources_in_group(access_token, group_id, dataset_id)

        if api_response.ok:
            return Response(api_response, api_response.status_code)
        else:
            if not api_response.text:
                return json.dumps({'errorMsg': str(f'Error {api_response.status_code} {api_response.reason}\nRequest Id:\t{api_response.headers.get("RequestId")}')}), api_response.status_code
            else:
                return json.dumps({'errorMsg': str(f'Error {api_response.status_code} {api_response.reason}\n{api_response.text}\nRequest Id:\t{api_response.headers.get("RequestId")}')}), api_response.status_code

    except Exception as ex:
        return json.dumps({'errorMsg': str(ex)}), 500


@app.route('/encryptcredential/updatedatasource', methods=['PUT'])
def update_datasource():
    ''' Updates the datasource with encrypted credentials '''

    try:
        access_token = AadService.get_access_token()

        request_data = request.json['data']
        gateway_id = request_data['gatewayId']
        gateway = {
            'id': gateway_id,
            'publicKey': None,
        }

        # Validate the credentials data by the user
        data_validation_service = DataValidationService()
        data_validation_service.validate_creds(request_data) 

        data_source_service = GetDatasourceService()
        gateway_api_response = data_source_service.get_gateway(access_token, gateway_id)

        if not gateway_api_response.ok:
            if not gateway_api_response.reason == "Not Found":
                return json.dumps({'errorMsg' : str(f'Error {gateway_api_response.status_code} {gateway_api_response.reason}\nRequest Id:\t{gateway_api_response.headers.get("RequestId")}')}), gateway_api_response.status_code
        else:
            gateway = gateway_api_response.json()

        # Send fetched data to update credentials
        update_creds_service = UpdateCredentialsService()
        api_response = update_creds_service.update_datasource(
            access_token, request_data['credType'], request_data[
                'privacyLevel'], request_data['credentialsArray'], gateway, request_data['datasourceId'])

        if api_response.ok:
            return Response(api_response, api_response.status_code)
        else:
            return json.dumps({'errorMsg': str(f'Error {api_response.status_code} {api_response.reason}\nRequest Id:\t{api_response.headers.get("RequestId")}')}), api_response.status_code

    except KeyError as tx:
        return json.dumps({'errorMsg': f'{str(tx)} not found'}), 400
    except ValueError as vx:
        return json.dumps({'errorMsg': f'Invalid {str(vx)}'}), 400
    except Exception as ex:
        return json.dumps({'errorMsg': str(ex)}), 500


@app.route('/encryptcredential/adddatasource', methods=['POST'])
def add_datasource():
    ''' Adds data source with encrypted credentials '''

    try:
        access_token = AadService.get_access_token()

        request_data = request.json['data']

        # Validate the credentials data by the user
        data_validation_service = DataValidationService()
        data_validation_service.validate_add_data_source(request_data)
        
        gateway_id = request_data['gatewayId']

        data_source_service = GetDatasourceService()
        gateway_api_response = data_source_service.get_gateway(access_token, gateway_id)

        if not gateway_api_response.ok:
            return json.dumps({'errorMsg' : str(f'Error {gateway_api_response.status_code} {gateway_api_response.reason}\nRequest Id:\t{gateway_api_response.headers.get("RequestId")}')}), gateway_api_response.status_code

        gateway = gateway_api_response.json()

        # If cloud gateway is used, return error
        if 'name' not in gateway:
            reason = 'Add data source is not supported for cloud gateway.'
            return json.dumps({'errorMsg': str(f'Error: {reason} ')}), 400

        # Send fetched data to add data source
        add_datasource_service = AddCredentialsService()
        api_response = add_datasource_service.add_data_source(
            access_token, gateway, request_data['dataSourceType'], request_data['connectionDetails'], request_data[
                'dataSourceName'], request_data['credType'], request_data['privacyLevel'], request_data['credentialsArray'])

        if api_response.ok:
            return Response(api_response, api_response.status_code)
        else:
            return json.dumps({'errorMsg': str(f'Error {api_response.status_code} {api_response.reason}\nRequest Id:\t{api_response.headers.get("RequestId")}')}), api_response.status_code
    
    except KeyError as tx:
        return json.dumps({'errorMsg': f'{str(tx)} not found'}), 400
    except ValueError as vx:
        return json.dumps({'errorMsg': f'Invalid {str(vx)}'}), 400
    except Exception as ex:
        return json.dumps({'errorMsg': str(ex)}), 500


@app.route('/encryptcredential/encrypt', methods=['POST'])
def encrypt_credentials():
    ''' Encrypts the credentials for datasource '''

    try:
        access_token = AadService.get_access_token()

        request_data = request.json['data']

        # Validate the credentials data by the user
        data_validation_service =  DataValidationService()
        data_validation_service.validate_encrypt_data(request_data)
        gateway_id = request_data['gatewayId']

        data_source_service = GetDatasourceService()
        gateway_api_response = data_source_service.get_gateway(access_token, gateway_id)

        if not gateway_api_response.ok:
            return json.dumps({'errorMsg' : str(f'Error {gateway_api_response.status_code} {gateway_api_response.reason}\nRequest Id:\t{gateway_api_response.headers.get("RequestId")}')}), gateway_api_response.status_code

        gateway = gateway_api_response.json()

        # Serialize credentials for encryption
        serialized_credentials = Utils.serialize_credentials(request_data['credentialsArray'], request_data['credType'])

        # Cloud gateway does not contain name property
        if 'name' not in gateway:
            return serialized_credentials

        # Encrypt the credentials Asymmetric Key Encryption
        asymmetric_encryptor_service = AsymmetricKeyEncryptor(gateway['publicKey'])
        encrypted_credentials_string = asymmetric_encryptor_service.encode_credentials(serialized_credentials)

        # If on-premise gateway is used, return encrypted data
        return encrypted_credentials_string

    except KeyError as tx:
        return json.dumps({'errorMsg': f'{str(tx)} not found'}), 400
    except ValueError as vx:
        return json.dumps({'errorMsg': f'Invalid {str(vx)}'}), 400
    except Exception as ex:
        return json.dumps({'errorMsg': str(ex)}), 500


if __name__ == '__main__':
    app.run()
