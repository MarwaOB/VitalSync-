
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

    def __str__(self):
        return f"{self.username} ({self.role})"