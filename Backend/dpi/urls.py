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


    
]