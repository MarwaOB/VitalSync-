
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





    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
<<<<<<< Updated upstream

    def __str__(self):
        return f"{self.username} ({self.role})"
=======
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
        return f"Admin Central: {self.first_name} {self.last_name}"

class AdminSys(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Admin System: {self.first_name} {self.last_name}"

class Medecin(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Medecin: {self.first_name} {self.last_name}"
    
class Pharmacien(CustomUser):
    class Meta:
        proxy = True

    def __str__(self):
        return f"Pharmacien: {self.first_name} {self.last_name}"    

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
    # Assuming a ForeignKey to CustomUser to associate a patient with their user account
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    person_a_contacter_telephone = models.JSONField(default=list, blank=True)  # Contact person phone numbers
    date_debut_hospitalisation = models.JSONField(default=list, blank=True)  # Start dates of hospitalization
    date_fin_hospitalisation = models.JSONField(default=list, blank=True)  # End dates of hospitalization

    def __str__(self):
        # Display patient name and hospitalization periods
        return f"Patient: {self.user.first_name} {self.user.last_name}, Hospitalization Periods: {', '.join([f'{start} - {end}' for start, end in zip(self.date_debut_hospitalisation, self.date_fin_hospitalisation)])}"
>>>>>>> Stashed changes
