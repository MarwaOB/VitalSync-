from django.urls import path
from . import views

urlpatterns = [
    #path('', views.sign_in, name='sign_in'),  # Corrected name
        path('creer_ord/', views.creer_ordonnance, name='creer_ord'),

    
]