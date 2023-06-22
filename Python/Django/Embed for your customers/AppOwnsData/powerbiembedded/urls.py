from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('get_embed_info/', views.get_embed_info, name='get_embed_info'),
]