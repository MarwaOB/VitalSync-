from django.db import models
from users.models import Patient
from io import BytesIO
from django.core.files import File
from PIL import Image
import qrcode
from django.core.mail import EmailMessage
from django.conf import settings
from django.core.exceptions import ValidationError


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

            # Convert qr_img to RGBA to avoid mode compatibility issues (use RGBA for transparency)
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

            self.QR_Code.save(filename, file_obj, save=False)

            file_obj.seek(0)  # Go back to the start of the file

            # Send the email with the QR code attached
            if self.patient and self.patient.user.email:
                subject = 'Your QR Code'
                message = 'Dear Patient, \n\nPlease find your QR code attached to this email.'
                email = EmailMessage(subject, message, settings.EMAIL_HOST_USER, [self.patient.user.email])

                # Attach the QR code image
                email.attach(filename, file_obj.read(), 'image/png')

                # Send the email
                email.send()

            # Close resources
            buffer.close()
            canvas.close()


class Consultation(models.Model):
    date = models.DateField(null=True, blank=True)  # Allow null and blank values
    dpi = models.ForeignKey(
        'Dpi', 
        on_delete=models.CASCADE, 
        related_name='consultations'
    )  # One-to-Many relationship with Dpi
    resume = models.TextField()

    def __str__(self):
        return f"Consultation on {self.date} for {self.dpi.patient.user.get_full_name()}"



class Bilan(models.Model):
    BILAN_TYPES = [
        ('biologique', 'Biologique'),
        ('radiologique', 'Radiologique'),
    ]
    
    
    bilan_type = models.CharField(
        max_length=20, choices=BILAN_TYPES, default='biologique'
    )  # Type of the bilan (biological or radiological)
    
    date = models.DateField(null=True, blank=True)  # Date of the bilan

    def clean(self):
        """
        Ensures that a consultation can only have 0 to 2 bilans.
        """
        if self.consultation.bilans.count() >= 2:
            raise ValidationError("A consultation can only have 2 bilans (biological or radiological).")

    def __str__(self):
        return f"Bilan {self.bilan_type} for Consultation on {self.consultation.date}"

    class Meta:
        abstract = True  # This class won't create its own table


class Biologique(Bilan):
    consultation = models.ForeignKey(
        'Consultation',
        on_delete=models.CASCADE,
        related_name='biologique_bilans'  # Unique related_name
    )
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
    tauxPressionArterielle = models.CharField(max_length=20, null=True, blank=True)  # Blood pressure (e.g., "120/80")
    tauxCholesterol = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  

    def __str__(self):
        return f"Biologique Bilan for Consultation on {self.consultation.date}"

class Radiologique(Bilan):  
    consultation = models.ForeignKey(
        'Consultation',
        on_delete=models.CASCADE,
        related_name='radiologique_bilans'  # Unique related_name
    )
    radioloque = models.ForeignKey(
        'users.CustomUser',
        on_delete=models.CASCADE,
        related_name='assigned_bilans_radioloque',
        limit_choices_to={'role': 'radioloque'},
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Radiologique Bilan for Consultation on {self.consultation.date}"

    
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
        return f"Examen {self.type} for Bilan {self.bilan_radiologique.consultation.date}"


class Diagnostic(models.Model):
   consultation = models.ForeignKey(
        'Consultation',
        on_delete=models.CASCADE,
        related_name='consultation_diagnostic'  # Unique related_name
    ) 
   
   ordonnance = models.OneToOneField('Ordonnance', on_delete=models.CASCADE, related_name='ordonnance' )

def __str__(self):
        return f"Diagnostic for consultation {self.consultation.date}"   

class Ordonnance(models.Model):
    diagnostic = models.OneToOneField('Diagnostic', on_delete=models.CASCADE, related_name='diagnostic' )
    duree = models.IntegerField(help_text="Duration of the prescription in days")
    is_valid = models.BooleanField(default=False)  # False = not valid, True = valid

def __str__(self):
        return f"Ordonnance for Diagnostic {self.consultation.date}" 

class Medicament(models.Model):
    nom = models.CharField(max_length=150)
    duree = models.IntegerField(help_text="Duration of the prescription in days")
    dose = models.DecimalField(max_digits=5, decimal_places=3, null=True, blank=True) 
    dosePrise = models.DecimalField(max_digits=5, decimal_places=3, null=True, blank=True) 
    dosePrevues = models.DecimalField(max_digits=5, decimal_places=3, null=True, blank=True) 
    ordonnance = models.ForeignKey(
        'Ordonnance',
        on_delete=models.CASCADE,
        related_name='meds'  # Unique related_name
    ) 
