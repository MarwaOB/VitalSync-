from django.test import TestCase
from users.models import CustomUser, Patient
from django.db import connection
from django.db.models import Max
from .models import (
    Antecedent, Dpi, Biologique, Radiologique, Examen, Diagnostic, Ordonnance, Medicament, Consultation, Soin, AdministrationMeds
)
from django.core.exceptions import ValidationError
from datetime import date

class ModelsTestCase(TestCase):
    def setUp(self):
        # Reset auto-increment values before each test
        with connection.cursor() as cursor:
            cursor.execute("ALTER TABLE dpi_dpi AUTO_INCREMENT = 1")
        # Ensure the database starts with a clean slate
        CustomUser.objects.all().delete()
        Patient.objects.all().delete()
        Dpi.objects.all().delete()

        # Create test users for the test cases
        self.medecin = CustomUser.objects.create(username="medecin1", role="medecin")
        self.patient_user = CustomUser.objects.create(username="patient1", NSS="331122")
        self.patient = Patient.objects.create(user=self.patient_user)

        # Create a DPI (Dossier Patient Informatisé) instance
        self.dpi = Dpi.objects.create(patient=self.patient, medecin=self.medecin)

    def test_antecedent_creation(self):
        # Test creation of an Antecedent linked to a DPI
        antecedent = Antecedent.objects.create(
            titre="Test Antecedent",
            description="Description of antecedent",
            is_chirugical=False,
            dpi=self.dpi
        )
        # Ensure the string representation is correct
        self.assertEqual(str(antecedent), f"Test Antecedent (DPI: {self.dpi.patient.user.username})")