from django.urls import path
from . import views

urlpatterns = [
    path('', views.sign_in, name='sign_in'),  # Corrected name
    path('admincentral/', views.admincentral, name='adminCentral'),  # Corrected path and name
    path('adminsys/', views.adminsys, name='adminSys'),  # Corrected path and name
    path('add-user/', views.add_user, name='add_user'),
    path('add-hospital/', views.add_hospital, name='add_hospital'),
    path('creerDPI/', views.creerDPI, name='creerDPI'),
    path('admincentralHome/', views.admin_Central_Home, name='admin_Central_Home'), 
    path('admincentralShow/', views.show_hospital, name='show_hospital'), 
    path('home/', views.admin_Sys_Home, name='admin_Sys_Home'),
    path('show_users_by_hospital/', views.show_users_by_hospital, name='show_users_by_hospital'),


]