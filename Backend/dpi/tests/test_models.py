from django.test import TestCase
from mixer.backend.django import mixer
from django.core.exceptions import ValidationError
from dpi.models import Ordonnance, Diagnostic


class AntecedentModelTest(TestCase):
    def setUp(self):
        self.dpi = mixer.blend('dpi.Dpi',patient=mixer.blend('users.Patient', user=mixer.blend('users.CustomUser', NSS='1212345')) )

    
        self.antecedent = mixer.blend('dpi.Antecedent', titre="Antécédent Test", dpi=self.dpi)

    def test_antecedent_str(self):
        self.assertEqual(
            str(self.antecedent), 
            f"{self.antecedent.titre} (DPI: {self.antecedent.dpi.patient.user.get_full_name()})"
        )
class DiagnosticModelTest(TestCase):
    def setUp(self):
        self.ordonnance = mixer.blend('dpi.Ordonnance', duree=15, is_valid=True, observation="Test Observation")
        self.diagnostic = mixer.blend('dpi.Diagnostic', ordonnance=self.ordonnance)

    def test_diagnostic_str(self):
        self.assertEqual(
            str(self.diagnostic),
            f"Diagnostic with ordonnance (Duration: {self.diagnostic.ordonnance.duree} days)"
        )

class OrdonnanceModelTest(TestCase):
    def setUp(self):
        self.ordonnance = mixer.blend('dpi.Ordonnance', duree=10, is_valid=True, observation="Test Observation")

    def test_ordonnance_str(self):
        valid_status = "valid" if self.ordonnance.is_valid else "not valid"
        self.assertEqual(
            str(self.ordonnance),
            f"Ordonnance ({valid_status}, {self.ordonnance.duree or 'no duration'} days)"
        )
class DpiModelTest(TestCase):
    def setUp(self):
        self.dpi = mixer.blend('dpi.Dpi', patient=mixer.blend('users.Patient'))

    def test_dpi_qr_code_generation(self):
        self.dpi.save()
        self.assertTrue(self.dpi.QR_Code)

class BiologiqueModelTest(TestCase):
    def setUp(self):
        self.biologique = mixer.blend(
            'dpi.Biologique',
            tauxGlycemie=5.5,
            tauxPressionArterielle=120.80,
            tauxCholesterol=200.50
        )

    def test_biologique_str(self):
        self.assertEqual(
            str(self.biologique),
            f"Biologique Bilan for Consultation "
        )

class RadiologiqueModelTest(TestCase):
    def setUp(self):
        self.radiologique = mixer.blend('dpi.Radiologique')

    def test_radiologique_str(self):
        self.assertEqual(
            str(self.radiologique),
            f"Radiologique Bilan for Consultation "
        )

class ExamenModelTest(TestCase):
    def setUp(self):
        self.radiologique = mixer.blend('dpi.Radiologique')
        self.examen = mixer.blend('dpi.Examen', type="Test", bilan_radiologique=self.radiologique)

    def test_examen_str(self):
        self.assertEqual(
            str(self.examen),
            f"Examen {self.examen.type} for Bilan {self.examen.bilan_radiologique}"
        ) 