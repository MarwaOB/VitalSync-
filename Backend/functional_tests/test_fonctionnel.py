import time  # Pour ajouter des pauses
from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from django.urls import reverse
from users.models import Patient, CustomUser
from dpi.models import Dpi  # Adaptez selon vos modèles

class TestCreationDPIWithVisuals(LiveServerTestCase):
    def setUp(self):
        # Configuration du navigateur WebDriver
        self.browser = webdriver.Chrome()  # Assurez-vous que le WebDriver est installé
        self.admin_user = CustomUser.objects.create_user(
            username='admin',
            password='password',
            role='adminSys'
        )
        self.hospital = self.admin_user.hospital
        self.patient = Patient.objects.create(
            user=CustomUser.objects.create_user(
                username='patient1',
                password='password',
                first_name='Test',
                last_name='Patient',
                NSS='153456789',
                hospital=self.hospital
            ),
            dpi_null=True
        )
        self.medecin = CustomUser.objects.create_user(
            username='medecin1',
            password='password',
            first_name='Test',
            last_name='Medecin',
            NSS='987654321',
            role='medecin',
            hospital=self.hospital
        )   

    def tearDown(self):
        self.browser.quit()

    def test_creation_dpi_with_antecedents_and_visuals(self):
        # Connexion en tant qu'utilisateur adminSys
        self.browser.get(self.live_server_url + reverse('sign_in'))
        time.sleep(2)  # Pause pour voir la page de connexion

        username_input = self.browser.find_element(By.NAME, "identifier")
        password_input = self.browser.find_element(By.NAME, "password")
        username_input.send_keys("admin")
        password_input.send_keys("password")
        password_input.send_keys(Keys.RETURN)
        time.sleep(2)  # Pause pour voir la redirection après connexion

        # Naviguer vers la page de création du DPI
        self.browser.get(self.live_server_url + reverse('creerDPI'))
        time.sleep(2)  # Pause pour voir la page de création du DPI

        # Attendre que le formulaire soit chargé
        WebDriverWait(self.browser, 10).until(
            EC.presence_of_element_located((By.NAME, 'patient'))
        )

        # Remplir le champ Patient (ici il est généré par {{ dpi_form.patient }})
        patient_field = self.browser.find_element(By.NAME, 'patient')
        patient_field.click()  # Ouvrir la liste déroulante
        time.sleep(2)  # Pause pour que la liste se charge
        patient_option = self.browser.find_element(By.XPATH, f"//option[@value='{self.patient.id}']")
        patient_option.click()  # Sélectionner le patient
        time.sleep(2)  # Pause pour voir la sélection

        # Si l'utilisateur est adminSys, remplir aussi le champ médecin
        if self.admin_user.role == 'adminSys':
            medecin_field = self.browser.find_element(By.NAME, 'medecin')
            medecin_field.click()  # Ouvrir la liste déroulante
            time.sleep(1)  # Pause pour que la liste se charge
            medecin_option = self.browser.find_element(By.XPATH, f"//option[@value='{self.medecin.id}']")
            medecin_option.click()  # Sélectionner le médecin
            time.sleep(2)  # Pause pour voir la sélection du médecin



        antecedent_title = self.browser.find_element(By.ID, 'id_form-0-titre')
        antecedent_title.send_keys("Antécédent Chirurgical")
        antecedent_description = self.browser.find_element(By.ID, 'id_form-0-description')
        antecedent_description.send_keys("Chirurgie cardiaque effectuée.")
        antecedent_is_chirurgical = self.browser.find_element(By.ID, 'id_form-0-is_chirugical')
        antecedent_is_chirurgical.click()  # Marquer comme chirurgical
        time.sleep(2)

        # Soumettre le formulaire
        submit_button = self.browser.find_element(By.XPATH, "//button[text()='Save DPI']")
        submit_button.click()
        time.sleep(2)  # Pause pour voir l'envoi du formulaire

        # Vérifier le succès
        WebDriverWait(self.browser, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'success-message'))
        )
        success_message = self.browser.find_element(By.CLASS_NAME, 'success-message')
        self.assertIn("DPI créé avec succès", success_message.text)
        time.sleep(1)  # Pause pour voir le message de succès