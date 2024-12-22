from django.urls import path
from . import views

urlpatterns = [
    #path('', views.sign_in, name='sign_in'),  # Corrected name
    path('creer_ord/', views.creer_ordonnance, name='creer_ord'),
    path('dpi/<int:dpi_id>/consultation/ajouter/', views.ajouter_consultation, name='ajouter_consultation'),
    path('consultation/<int:consultation_id>/bilan/', views.ajouter_bilan, name='ajouter_bilan'),
    path('consultation/<int:consultation_id>/diagnostic/', views.ajouter_diagnostic, name='ajouter_diagnostic'),

    
]