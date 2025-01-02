import pytest
from django.urls import reverse
from django.utils.timezone import now
from users.models import Patient, CustomUser
from dpi.models import Consultation, Dpi ,Biologique, Radiologique
from hospitals.models import Hospital
from django.test import TestCase, Client
from mixer.backend.django import mixer
from django.test import TestCase

@pytest.fixture
def setup_data():
    # Création d'un hôpital avec mixer
    hospital = mixer.blend(
        Hospital,
        nom="Hopital Test",
        lieu="123 Test St",
        dateCreation="2024-01-01",
        nombrePatients=100,
        nombrePersonnels=50,
        is_clinique=False
    )

    # Création d'un médecin avec mixer
    medecin = mixer.blend(
        CustomUser,
        username="testermedecin",
        role="medecin"
    )
    medecin.set_password("testpassword")
    medecin.save()

    # Création d'un utilisateur patient avec mixer
    user = mixer.blend(
        CustomUser,
        username="testeruser",
        role="patient",
        first_name="Test",
        last_name="User",
        email="testuser@example.com",
        NSS=123456789,
        telephone="1234567890",
        adresse="123 Test St",
        hospital=hospital
    )
    user.set_password("testpassword")
    user.save()

    # Création d'un objet Patient et DPI avec mixer
    patient = mixer.blend(Patient, user=user)
    dpi = mixer.blend(Dpi, patient=patient)

    return {"hospital": hospital, "medecin": medecin, "user": user, "patient": patient, "dpi": dpi}



@pytest.mark.django_db
def test_ajouter_consultation_success(client, setup_data):
    # Récupération des données depuis la fixture
    dpi = setup_data["dpi"]
    medecin = setup_data["medecin"]

    # Connexion de l'utilisateur médecin
    client.login(username=medecin.username, password="testpassword")

    # Appel de la vue pour ajouter une consultation
    url = reverse('ajouter_consultation', args=[dpi.id])
    response = client.get(url)

    # Vérification de la réponse
    assert response.status_code == 200
    assert Consultation.objects.filter(dpi=dpi, date=now().date()).exists()


@pytest.mark.django_db
def test_ajouter_consultation_duplicate(client, setup_data):
    dpi = setup_data["dpi"]
    medecin = setup_data["medecin"]

    client.login(username=medecin.username, password="testpassword")

    # Création de la consultation avec mixer
    mixer.blend(Consultation, dpi=dpi, date=now().date())

    url = reverse('ajouter_consultation', args=[dpi.id])
    response = client.get(url)

    print(response.content.decode())

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
