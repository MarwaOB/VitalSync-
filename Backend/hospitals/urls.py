from django.urls import path
from . import views

urlpatterns = [

     path('hospitals/', views.show_Hospitals, name='show_Hospitals'),
     path('hospitals/add', views.add_hospital, name='add_hospital'),

]