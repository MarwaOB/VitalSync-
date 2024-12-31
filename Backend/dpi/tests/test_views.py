import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from users.models import Patient, CustomUser
from django.test import TestCase, Client
from mixer.backend.django import mixer
from dpi.models import Consultation, Diagnostic, Ordonnance, Biologique, Radiologique

@pytest.mark.django_db
def test_ajouter_consultation_success(client):

    # Création d'un utilisateur de type patient
    medecin = CustomUser.objects.create_user(username="testmedecin", password="testpassword", role='medecin')

    user = CustomUser.objects.create_user(username="testuser", password="testpassword", role='patient')
    
    # Création d'un objet Patient associé à cet utilisateur
    patient = Patient.objects.create(user=user)

    # Connexion de l'utilisateur
    client.login(username="testmedecin", password="testpassword")

    # Création d'un DPI pour cet utilisateur de type patient
    dpi = Dpi.objects.create(patient=patient)

    # Appel de la vue pour ajouter une consultation
    url = reverse('ajouter_consultation', args=[dpi.id])
    response = client.get(url)

    # Vérification de la réponse
    assert response.status_code == 200
    assert Consultation.objects.filter(dpi=dpi, date=now().date()).exists()


@pytest.mark.django_db
def test_ajouter_consultation_duplicate(client):

    # Création d'un utilisateur connecté (CustomUser)
    medecin = CustomUser.objects.create_user(username="testmedecin", password="testpassword", role='medecin')

    
    user = CustomUser.objects.create_user(username="testuser", password="testpassword")
    
    client.login(username="testuser", password="testpassword")

    patient = Patient.objects.create(user=user)

    # Création d'un DPI
    dpi = Dpi.objects.create(patient=patient)

    # Création d'une consultation pour aujourd'hui
    Consultation.objects.create(dpi=dpi, date=now().date())

    # Appel de la vue
    url = reverse('ajouter_consultation', args=[dpi.id])
    response = client.get(url)

    # Debugging: Afficher le contenu de la réponse pour vérifier la présence du message
    print(response.content.decode())

    # Vérification du message d'erreur
    assert response.status_code == 200
    assert "Une consultation à la même date pour ce patient existe déjà." in response.content.decode()


@pytest.mark.django_db
def test_ajouter_consultation_login_required(client):

    # Tentative d'accès à la vue sans être connecté
    url = reverse('ajouter_consultation', args=[1])  # DPI avec ID 1
    response = client.get(url)

    # Vérification de la redirection vers la page de connexion
    assert response.status_code == 302  # Redirection
    assert "/accounts/login/" in response.url  # Vérifie que l'utilisateur est redirigé

# test unitaire sur consultationn detail 

class ConsultationDetailViewTest(TestCase):
    def setUp(self):
        # Initialisation du client de test
        self.client = Client()
        
        # Création des objets nécessaires pour le test
        self.bilan_biologique = mixer.blend(Biologique, tauxGlycemie=5.5, tauxCholesterol=200.0)
        self.bilan_radiologique = mixer.blend(Radiologique, description="Radiographie thoracique")
        self.consultation = mixer.blend(
            Consultation, 
            bilanBiologique=self.bilan_biologique, 
            bilanRadiologique=self.bilan_radiologique
        )
    
    def test_consultation_detail_view(self):
        # Génération de l'URL pour la vue
        url = reverse('consultation_detail', args=[self.consultation.id])
        
        # Envoi de la requête GET
        response = self.client.get(url)
        
        # Vérifications des réponses
        self.assertEqual(response.status_code, 200)  # Vérifie que le statut HTTP est 200
        self.assertTemplateUsed(response, "consultation_detail.html")  # Vérifie que le bon template est utilisé
        
        # Vérification du contexte
        self.assertEqual(response.context["consultation"], self.consultation)
        self.assertEqual(response.context["bilan_biologique"], self.bilan_biologique)
        self.assertEqual(response.context["bilan_radiologique"], self.bilan_radiologique)
