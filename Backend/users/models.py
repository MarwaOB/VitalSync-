from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from hospitals.models import Hospital  # Adjust the import path based on your project structure
from django.db import models
from datetime import datetime


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('adminCentral', 'Adminstrateur Central'),
        ('adminSys', 'Administrateur Systeme'),
        ('patient', 'Patient'),
        ('medecin', 'Medecin'),
        ('infermier', 'Infermier'),
        ('radioloque', 'Radioloque'),
        ('laborantin', 'Laborantin'),
        ('pharmacien', 'Pharmacien'),
    ]
    NSS = models.IntegerField(default=0)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    date_de_naissance = models.DateField(null=True, blank=True)  # Allow null and blank values
    adresse = models.TextField()  # Address
    telephone = models.CharField(max_length=15)  # Phone number
    mutuelle = models.FileField(upload_to='mutuelle_pdfs/', null=True, blank=True)
    hospital = models.ForeignKey(
    'hospitals.Hospital',  # Use the app label and model name if the model is in another app
    on_delete=models.CASCADE,
    null=True,
    blank=True
    )


    def clean(self):
        """
        Custom validation logic to ensure adminCentral users do not have a hospital.
        """
        if ( self.role == 'pharmacien') and self.hospital is not None:
            raise ValidationError("AdminCentral users cannot be associated with a hospital.")

    def save(self, *args, **kwargs):
        """
        Override the save method to include the custom validation.
        """
        self.clean()  # Run custom validation
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.role})"
    
# Proxy models for different roles
class AdminCentral(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Admin Central: {self.first_name} {self.last_name}"

class AdminSys(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Admin System: {self.first_name} {self.last_name}"
    
class Pharmacien(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Pharmacien: {self.first_name} {self.last_name}"    

class Medecin(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Medecin: {self.first_name} {self.last_name}"
       

class Infermier(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Infermier: {self.first_name} {self.last_name}"

class Radioloque(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Radioloque: {self.first_name} {self.last_name}"

class Biologiste(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Biologiste: {self.first_name} {self.last_name}"

class Laborantin(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Laborantin: {self.first_name} {self.last_name}"

# Patient Model
class Patient(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    person_a_contacter_telephone = models.JSONField(default=list, blank=True)
    date_debut_hospitalisation = models.JSONField(default=list, blank=True)
    date_fin_hospitalisation = models.JSONField(default=list, blank=True)
    dpi_null = models.BooleanField(default=True)

    def clean(self):
        """
        Validation for hospitalisation dates.
        """
        if len(self.date_debut_hospitalisation) != len(self.date_fin_hospitalisation):
            raise ValidationError("Start and end dates of hospitalization must have the same length.")
        
        for start, end in zip(self.date_debut_hospitalisation, self.date_fin_hospitalisation):
            if datetime.fromisoformat(start) > datetime.fromisoformat(end):
                raise ValidationError(f"Start date {start} cannot be after end date {end}.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)