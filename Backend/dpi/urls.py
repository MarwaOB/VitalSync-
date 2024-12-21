from django.urls import path
from . import views

urlpatterns = [
    path('ajouter_bilan/<int:dpi_id>/', views.ajouter_bilan, name='ajouter_bilan'),
    path('ajouter_diagnostic/<int:dpi_id>/', views.ajouter_diagnostic, name='ajouter_diagnostic'),

    
]