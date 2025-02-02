from django.urls import reverse, resolve
from django.test import TestCase

class TestUrls(TestCase):

    def test_dpi_ajouter_url(self):
        """
        Vérifie que l'URL nommée 'ajouter_diagnostic' est correctement résolue.
        """

        # Génère l'URL correspondant à la vue 'ajouter_diagnostic' avec un ID de consultation = 1
        path = reverse('ajouter_diagnostic', kwargs={'consultation_id': 1})

        # Vérifie que l'URL générée correspond bien à la vue attendue
        assert resolve(path).view_name == 'ajouter_diagnostic'
        

    def test_consultation_detail_url(self):
        path = reverse('consultation_detail', kwargs={'consultation_id': 1})
        assert resolve(path).view_name == 'consultation_detail'

    def test_ordonnance_view_url(self):
        path = reverse('ord-view', kwargs={'consultation_id': 1, 'diagnostic_id': 1})
        assert resolve(path).view_name == 'ord-view'

    def test_creer_ord_url(self):
        path = reverse('creer_ord', kwargs={'consultation_id': 1})
        assert resolve(path).view_name == 'creer_ord'

    def test_ajouter_consultation_url(self):
        path = reverse('ajouter_consultation', kwargs={'dpi_id': 1})
        assert resolve(path).view_name == 'ajouter_consultation'

    def test_afficher_ordonnances_non_valide_url(self):
        path = reverse('afficher_ordonnances_non_valide')
        assert resolve(path).view_name == 'afficher_ordonnances_non_valide'

    def test_validee_ord_url(self):
        path = reverse('validee_ord', kwargs={'ordonnance_id': 1})
        assert resolve(path).view_name == 'validee_ord'
