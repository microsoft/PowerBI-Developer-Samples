from django.shortcuts import render
from .models import PowerBIEmbedService
from django.http import HttpResponse
import json
from Django.utils import Utils
from Django.config import BaseConfig


def get_embed_info(request):

    try:
        embed_info = PowerBIEmbedService().get_embed_params_for_report(
            BaseConfig.WORKSPACE_ID,
            BaseConfig.REPORT_ID
        )
        return HttpResponse(json.dumps(embed_info).strip("'"), content_type='application/json')
    except Exception as ex:
        return HttpResponse(json.dumps({'errorMsg': str(ex)}), status=500)


def index(request):
    config_result = Utils.check_config(BaseConfig)
    if config_result is not None:
        return HttpResponse(str(config_result))

    return render(request, 'base.html')
