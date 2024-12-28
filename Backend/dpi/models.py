from django.db import models
from users.models import Patient
from io import BytesIO
from django.core.files import File
from PIL import Image
import qrcode
from django.core.mail import EmailMessage
from django.conf import settings
from django.core.exceptions import ValidationError
from django. template. loader import get_template 
from xhtml2pdf import pisa



class Antecedent(models.Model):
    titre = models.CharField(max_length=150)
    description = models.TextField()
    is_chirugical = models.BooleanField(default=False)  # False = medical, True = chirugical
    dpi = models.ForeignKey(
        'Dpi', 
        on_delete=models.CASCADE, 
        related_name='antecedents'
    )  # One-to-Many relationship with Dpi

    def __str__(self):
        return f"{self.titre} (DPI: {self.dpi.nom})"

class Dpi(models.Model):
    QR_Code = models.ImageField(upload_to='qr_codes/', blank=True)

    patient = models.OneToOneField(
        'users.Patient',
        on_delete=models.CASCADE,
        related_name='dpi',
        null=True,
        blank=True
    )

    medecin = models.ForeignKey(
        'users.CustomUser',
        on_delete=models.CASCADE,
        related_name='assigned_dpis_medecin',
        limit_choices_to={'role': 'medecin'},
        null=True,
        blank=True
    )

    def save(self, *args, **kwargs):
    # Save the DPI instance first
     super().save(*args, **kwargs)

    # Generate QR Code based on the patient's NSS
     if self.patient and self.patient.user.NSS:
        qr_data = self.patient.user.NSS
        qr_img = qrcode.make(qr_data)

        # Convert qr_img to RGBA to avoid mode compatibility issues
        qr_img = qr_img.convert('RGBA')

        canvas = Image.new('RGBA', (290, 290), (255, 255, 255, 255))  # White background with transparency

        # Calculate the position to center the QR code
        qr_width, qr_height = qr_img.size
        canvas_width, canvas_height = canvas.size

        left = (canvas_width - qr_width) // 2  # Center horizontally
        upper = (canvas_height - qr_height) // 2  # Center vertically
        box = (left, upper, left + qr_width, upper + qr_height)

        # Paste the QR code onto the canvas
        canvas.paste(qr_img, box, qr_img)  # Using the mask to ensure transparency is preserved

        # Create a filename
        filename = f'qr_code_{self.patient.user.NSS}.png'

        # Save to the QR_Code field
        buffer = BytesIO()
        canvas.save(buffer, format='PNG')
        file_obj = File(buffer)

        self.QR_Code.save(filename, file_obj, save=False)  # Save the QR code file

        # Save the DPI instance again to persist the QR_Code field
        super().save(*args, **kwargs)

        # Send the email with the QR code attached
        if self.patient and self.patient.user.email:
            subject = 'Your QR Code'
            message = 'Dear Patient, \n\nPlease find your QR code attached to this email.'
            email = EmailMessage(subject, message, settings.EMAIL_HOST_USER, [self.patient.user.email])

            # Attach the QR code image
            file_obj.seek(0)  # Reset the file pointer to the beginning
            email.attach(filename, file_obj.read(), 'image/png')

            # Send the email
            email.send()

        # Close resources
        buffer.close()
        canvas.close()



class Bilan(models.Model):
    BILAN_TYPES = [
        ('biologique', 'Biologique'),
        ('radiologique', 'Radiologique'),
    ]
    
    
    bilan_type = models.CharField(
        max_length=20, choices=BILAN_TYPES, default='biologique'
    )  # Type of the bilan (biological or radiological)
    
    date = models.DateField(null=True, blank=True)  # Date of the bilan


    def __str__(self):
        return f"Bilan {self.bilan_type} for Consultation "

    class Meta:
        abstract = True  # This class won't create its own table


class Biologique(Bilan):
    
    laborantin = models.ForeignKey(
        'users.CustomUser',
        on_delete=models.CASCADE,
        related_name='assigned_bilans_laborantin',
        limit_choices_to={'role': 'laborantin'},
        null=True,
        blank=True
    )
    description = models.TextField()
    tauxGlycemie = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True) 
    #tauxPressionArterielle = models.CharField(max_length=20, null=True, blank=True)  # Blood pressure (e.g., "120/80")
    tauxPressionArterielle = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  
    tauxCholesterol = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  

    def __str__(self):
        return f"Biologique Bilan for Consultation "

class Radiologique(Bilan):  
    
    radioloque = models.ForeignKey(
        'users.CustomUser',
        on_delete=models.CASCADE,
        related_name='assigned_bilans_radioloque',
        limit_choices_to={'role': 'radioloque'},
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Radiologique Bilan for Consultation "

    
class Examen(models.Model):

    type = models.CharField(max_length=100)
    description = models.TextField()
    images = models.ImageField(upload_to='exams/', blank=True, null=True)  

    # Link each exam to one Radiologique bilan
    bilan_radiologique = models.ForeignKey(
        'Radiologique',  # Link to the Radiologique model
        on_delete=models.CASCADE,
        related_name='examens'  # Allows access to all related examens from a Radiologique bilan
    )

    def __str__(self):
        return f"Examen {self.type} for Bilan {self.bilan_radiologique}"


class Diagnostic(models.Model):
   
   ordonnance = models.OneToOneField('Ordonnance', on_delete=models.CASCADE, related_name='ordonnance' )

def __str__(self):
        return f"Diagnostic for consultation "   

class Ordonnance(models.Model):
    
    duree = models.IntegerField( null=True, blank=True,help_text="Duration of the prescription in days")
    is_valid = models.BooleanField(default=False)  # False = not valid, True = valid
    observation = models.TextField(null=True, blank=True)

def __str__(self):
        return f"Ordonnance for Diagnostic " 

class Medicament(models.Model):
    
    # Nom du médicament
    nom = models.CharField(max_length=150)
    # Durée du traitement en jours
    duree = models.IntegerField()
    # Fréquence de prise (ex : 3 fois/jour)
    frequence = models.IntegerField(null=True, blank=True)  # Autorise les valeurs nulles
    # Dose par prise
    dose = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)
    # Unité de mesure (mg, ml, etc.)
    unite = models.CharField(max_length=20,null=True, blank=True)
    # Mode d'administration
    mode_administration = models.CharField(max_length=50, null=True, blank=True)
    #ajouter une observation , indication, retriction 
    observation = models.TextField(null=True, blank=True)
    # Dose prise à chaque prise
    dosePrise = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)
    # Dose totale prévue pour le traitement
    dosePrevues = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)
     # la quantité de med
    qte = models.IntegerField(default = 1)

    # Référence vers l'ordonnance
    ordonnance = models.ForeignKey(
        'Ordonnance',
        on_delete=models.CASCADE,
        related_name='meds'  # Nom unique pour la relation inverse
    )

    def clean(self):
        if self.duree < 0:
            raise ValidationError("La durée doit être positive.")
        if self.dose and self.dose < 0:
            raise ValidationError("La dose doit être positive.")


class Consultation(models.Model):
    date = models.DateField(null=True, blank=True)  # Allow null and blank values
    dpi = models.ForeignKey(
        'Dpi', 
        on_delete=models.CASCADE, 
        related_name='consultations'
    )  # One-to-Many relationship with Dpi
    resume = models.TextField()
    diagnostic = models.OneToOneField(
        'Diagnostic', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='consultation'
    )  # One diagnostic, but it can be null

    bilanBiologique = models.OneToOneField(
        'Biologique', 
        on_delete=models.SET_NULL, 
        related_name='bilanBiologique',
        null=True, 
        blank=True
    )  # One bilanBiologique, but it can be null

    is_bilanBiologique_fait = models.BooleanField(default=False)  # False = not fait, True = fait
    is_bilanRadiologique_fait = models.BooleanField(default=False)  # False = not fait, True = fait

    bilanRadiologique = models.OneToOneField(
        'Radiologique', 
        on_delete=models.SET_NULL, 
        related_name='bilanRadiologique', 
        null=True, 
        blank=True
    )  # One bilanRadiologique, but it can be null
    grapheBiologique = models.ImageField(upload_to='graphesBiologiques/', blank=True)


    def clean(self):
        """
        Ensures that a consultation can only have 0 to 2 bilans.
        """
        if (self.bilanBiologique or self.bilanRadiologique) and self.diagnostic:
            raise ValidationError("A consultation can only have bilans or a diagnostic .")
        
    def __str__(self):
        return f"Consultation on {self.date} for {self.dpi.patient.user.get_full_name()}"

class Soin(models.Model):
    dpi = models.ForeignKey(
        'Dpi', 
        on_delete=models.CASCADE, 
        related_name='soins'
    )  # One-to-Many relationship with Dpi
    
    aministration = models.OneToOneField(
        'AdministrationMeds',
        on_delete=models.SET_NULL,  # Change this from CASCADE to SET_NULL
        related_name='administration_meds',
        null=True,  # Allow setting to NULL
    )

    diagnostic = models.OneToOneField(
        'Diagnostic',
        on_delete=models.SET_NULL,  # Change this from CASCADE to SET_NULL
        related_name='diagnostic_soin',
        null=True,  # Allow setting to NULL
    )



    def clean(self):
        """
        Ensure that at least one nurse is assigned to the Soin.
        """
        super().clean()
        if not self.infermiers.exists():
            raise ValidationError("A Soin must have at least one Infermier assigned.")

    def __str__(self):
        return f"Soin for {self.dpi.patient.user.get_full_name()} - Observation: {self.observation[:30]}..."


class AdministrationMeds(models.Model):
    checklist = models.JSONField(default=dict, blank=True)  # Stores the checklist as a dictionary
    ordonnance = models.OneToOneField(
        'Ordonnance',
        on_delete=models.CASCADE,
        related_name='administration_meds'
    )

    def update_checklist(self):
        """
        Updates the checklist based on the ordonnance's medications.
        Each medication in the ordonnance is represented in the checklist with its administration status.
        """
        if self.ordonnance:
            self.checklist = {
                med.nom: False for med in self.ordonnance.meds.all()
            }
            self.save()

    def mark_as_administered(self, medication_name):
        """
        Marks a medication as administered in the checklist.
        """
        if medication_name in self.checklist:
            self.checklist[medication_name] = True
            self.save()
        else:
            raise ValueError(f"Medication '{medication_name}' not found in the checklist.")

    def all_administered(self):
        """
        Checks if all medications in the checklist are administered.
        """
        return all(self.checklist.values())

    def __str__(self):
        return f"Administration Checklist for Ordonnance {self.ordonnance}"

class SoinInfermierObservation(models.Model):
    """
    Represents an observation related to a nurse's care (Soin).
    """
    date_time = models.DateTimeField(auto_now_add=True)  # Automatically set the date and time when the record is created
    observation = models.TextField()  
    soins_infermier = models.TextField() 
    infermier = models.ForeignKey(
        'users.CustomUser',
        on_delete=models.CASCADE,
        related_name='assigned_soins_infermiers',
        limit_choices_to={'role': 'infermier'},
        null=True,
        blank=True
    )

    soin = models.ForeignKey(
        'Soin', 
        on_delete=models.CASCADE, 
        related_name='observations'
    )  # Links each observation to a specific Soin (care)

    def __str__(self):
        return f"Observation for Soin ID {self.soin.id} at {self.date_time.strftime('%Y-%m-%d %H:%M:%S')}"
