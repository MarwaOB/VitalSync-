from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('adminCentral', 'Adminstrateur Central'),
        ('adminSys', 'Administrateur Systeme'),
        ('patient', 'Patient'),
        ('medecin', 'Medecin'),
        ('infermier', 'Infermier'),
        ('radioloque', 'Radioloque'),
        ('biologiste', 'Biologiste'),
        ('laborantin', 'Laborantin'),
        ('pharmacien', 'Pharmacien'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    numero_securite_sociale = models.CharField(max_length=15, unique=True)  # Security number
    nom = models.CharField(max_length=50)  # Last name
    prenom = models.CharField(max_length=50)  # First name
    date_de_naissance = models.DateField()  # Date of birth
    adresse = models.TextField()  # Address
    telephone = models.CharField(max_length=15)  # Phone number
    mutuelle = models.CharField(max_length=5000, blank=True, null=True)  # Insurance

    def __str__(self):
        return f"{self.username} ({self.role})"

# Proxy models for different roles
class AdminCentral(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Admin Central: {self.nom} {self.prenom}"

class AdminSys(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Admin System: {self.nom} {self.prenom}"

class Medecin(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Medecin: {self.nom} {self.prenom}"
    
class Pharmacien(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Pharmacien: {self.nom} {self.prenom}"    

class Infermier(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Infermier: {self.nom} {self.prenom}"

class Radioloque(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Radioloque: {self.nom} {self.prenom}"

class Biologiste(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Biologiste: {self.nom} {self.prenom}"

class Laborantin(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Laborantin: {self.nom} {self.prenom}"

# Patient Model
class Patient(models.Model):
    person_a_contacter_telephone = models.JSONField(default=list, blank=True)  # Contact person phone numbers
    date_debut_hospitalisation = models.JSONField(default=list, blank=True)  # Start dates of hospitalization
    date_fin_hospitalisation = models.JSONField(default=list, blank=True)  # End dates of hospitalization

    def __str__(self):
        # Display patient name and hospitalization periods
        return f"Patient: {self.user.nom} {self.user.prenom}, Hospitalization Periods: {', '.join([f'{start} - {end}' for start, end in zip(self.date_debut_hospitalisation, self.date_fin_hospitalisation)])}"
