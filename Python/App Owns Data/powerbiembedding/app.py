from aadservice import getaccesstoken
from pbiembedservice import getembedparam
from flask import Flask, render_template, request, send_from_directory
import json
import os
import requests

# Initialize the Flask app
app = Flask(__name__)

# Used to toggle debug statements
app.debug = False

# Load configuration
app.config.from_object('config.BaseConfig')

@app.route('/')
def index():
    '''Returns a static HTML page'''

    return render_template('index.html')

@app.route('/getembedinfo', methods=['GET'])
def getembedinfo():
    '''Returns Embed token and Embed URL'''

    configresult = checkconfig()
    if configresult is None:
        try:
            accesstoken = getaccesstoken()
            embedinfo = getembedparam(accesstoken)
        except Exception as ex:
            return json.dumps({'errorMsg': str(ex)}), 500
    else:
        return json.dumps({'errorMsg': configresult}), 500

    return embedinfo

def checkconfig():
    '''Returns a message to user for a missing configuration'''
    if app.config['AUTHENTICATION_MODE'] == '':
        return 'Please specify one the two authentication modes'
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
    elif app.config['SCOPE'] == '':
        return 'Scope is not provided in the config.py file'
    elif app.config['AUTHORITY_URL'] == '':
        return 'Authority URL is not provided in the config.py file'
    
    return None


@app.route('/favicon.ico', methods=['GET'])
def getfavicon():
    '''Returns path of the favicon to be rendered'''

    return send_from_directory(os.path.join(app.root_path, 'static'), 'img/favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == '__main__':
    app.run()