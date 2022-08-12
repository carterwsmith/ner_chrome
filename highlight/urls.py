from django.contrib import admin
from django.urls import include, path
from django.conf.urls import url
from highlight import views

urlpatterns = [
    path('', views.index, name='index'),
    url(r'^find_entities/$', views.find_entities, name='highlight'),
]