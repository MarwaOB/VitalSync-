import qrcode
from django.db import models
from users.models import Patient
from io import BytesIO
from django.core.files import File
from PIL import Image
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
    diagnostic = models.OneToOneField('Diagnostic', on_delete=models.CASCADE, related_name='diagnostic' )
    duree = models.IntegerField(help_text="Duration of the prescription in days")
    is_valid = models.BooleanField(default=False)  # False = not valid, True = valid

def __str__(self):
        return f"Ordonnance for Diagnostic " 

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

