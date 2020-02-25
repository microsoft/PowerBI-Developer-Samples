from flask import current_app as app
import requests
import json

def getembedparam(accesstoken):
    '''Returns Embed token and Embed URL'''

    try:
        headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accesstoken}

        reporturl = 'https://api.powerbi.com/v1.0/myorg/groups/' + app.config['WORKSPACE_ID'] + '/reports/' + app.config['REPORT_ID']
        
        apiresponse = None

        try:
            apiresponse = requests.get(reporturl, headers=headers)
            if app.debug:
                print('Embed URL Request ID: ', apiresponse.headers.get('RequestId'))
        except Exception as ex:
            raise Exception('Error while retrieving report Embed URL\n')

        if not apiresponse:
            raise Exception('Error while retrieving report Embed URL\n' + apiresponse.reason + '\nRequestId: ' + apiresponse.headers.get('RequestId'))

        try:
            apiresponse = json.loads(apiresponse.text)
            embedurl = apiresponse['embedUrl']
            datasetId = apiresponse['datasetId']
        except Exception as ex:
            raise Exception('Error while extracting Embed URL from API response\n' + apiresponse.text)
            
        # Get embed token
        embedtokenurl = 'https://api.powerbi.com/v1.0/myorg/GenerateToken'
        body = {'datasets': []}
        if datasetId != '':
            body['datasets'].append({'id': datasetId})

        if app.config['REPORT_ID'] != '':
            body['reports'] = []
            body['reports'].append({'id': app.config['REPORT_ID']})

        if app.config['WORKSPACE_ID'] != '':
            body['targetWorkspaces'] = []
            body['targetWorkspaces'].append({'id': app.config['WORKSPACE_ID']})

        apiresponse = None
        
        try:
            
            # Generate Embed token for multiple workspaces, datasets, and reports. Refer https://aka.ms/MultiResourceEmbedToken
            apiresponse = requests.post(embedtokenurl, data=json.dumps(body), headers=headers)
            if app.debug:
                print('Embed token Request ID: ', apiresponse.headers.get('RequestId'))
        except:
            raise Exception('Error while invoking Embed token REST API endpoint\n')
        
        if not apiresponse:
            raise Exception('Error while retrieving report Embed URL\n' + apiresponse.reason + '\nRequestId: ' + apiresponse.headers.get('RequestId'))

        try:
            apiresponse = json.loads(apiresponse.text)
            embedtoken = apiresponse['token']
            embedtokenid = apiresponse['tokenId']
            tokenexpiry = apiresponse['expiration']
            if app.debug:
                print('Embed token Expires on: ', tokenexpiry)
                print('Embed Token ID: ', embedtokenid)
        except Exception as ex:
            raise Exception('Error while extracting Embed token from API response\n' + apiresponse.reason)

        response = {'accessToken': embedtoken, 'embedUrl': embedurl, 'tokenExpiry': tokenexpiry}
        return json.dumps(response)
    except Exception as ex:
        return json.dumps({'errorMsg': str(ex)}), 500