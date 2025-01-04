from django.urls import path
from . import views

urlpatterns = [
    path('dpi/<int:dpi_id>/consultation/ajouter/', views.ajouter_consultation, name='ajouter_consultation'),
    path('consultation/<int:consultation_id>/diagnostic/', views.ajouter_diagnostic, name='ajouter_diagnostic'),
    path('consultation/<int:consultation_id>/', views.consultation_detail, name='consultation_detail'),
    path("ajouter_biologique_bilan/<int:consultation_id>/", views.ajouter_biologique_bilan, name="ajouter_biologique_bilan"),
    path("ajouter_radiologique_bilan/<int:consultation_id>/", views.ajouter_radiologique_bilan, name="ajouter_radiologique_bilan"),
    path("ajouter_resume/<int:consultation_id>/", views.ajouter_resume, name="ajouter_resume"),
    path("ajouter_examen/<int:consultation_id>/", views.ajouter_examen, name="ajouter_examen"),
    path("show_dpi", views.show_dpi, name="show_dpi"),
    path('show_antecedant/<int:patient_id>/', views.show_antecedant, name='show_antecedant'),
    path("ajouter_antecedant_api", views.ajouter_antecedant_api, name="ajouter_antecedant_api"),
    path('show_consultations/<int:patient_id>/', views.show_consultations, name='show_consultations'),
    path("ajouter_Consultation_api", views.ajouter_Consultation_api, name="ajouter_Consultation_api")

    
]