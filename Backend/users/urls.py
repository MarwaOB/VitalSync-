from django.urls import path
from . import views

urlpatterns = [
    path('adminCentralDashboard', views.adminCentral_dashboard, name='adminCentral_dashboard'),
    path('adminSysDashboard', views.adminSys_dashboard, name='adminSys_dashboard'),

]