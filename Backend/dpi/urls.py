from django.urls import path
from . import views

urlpatterns = [
    path('consultation/<int:consultation_id>/<int:diagnostic_id>/ordonnance-view', views.render_pdf_view, name='ord-view'),  # Corrected name
    path('dpi/<int:dpi_id>/consultation/ajouter/', views.ajouter_consultation, name='ajouter_consultation'),
    path('consultation/<int:consultation_id>/bilan/', views.ajouter_bilan, name='ajouter_bilan'),
    path('consultation/<int:consultation_id>/diagnostic/', views.ajouter_diagnostic, name='ajouter_diagnostic'),
]