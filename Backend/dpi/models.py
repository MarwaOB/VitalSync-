from django.db import models
from django.http import Http404
from users.models import Patient  # Adjust the import path based on your project structure


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

    QR_Code = models.ImageField(upload_to='qr_codes', blank=True)

    patient = models.OneToOneField(
        'users.Patient', 
        on_delete=models.CASCADE, 
        related_name='patient',
        null=True,  # Allow null initially
        blank=True  # Allow blank input
    )

    medecin = models.ForeignKey(
        'users.CustomUser', 
        on_delete=models.CASCADE, 
        related_name='assigned_dpis',
        limit_choices_to={'role': 'medecin'},  # Only allow users with role 'medecin'
        null=True,  # Allow null initially
        blank=True  # Allow blank input
    )

    def clean(self):
        """
        Custom validation to ensure the assigned medecin has the correct role.
        """
        if self.medecin.role != 'medecin':
            raise Http404("Assigned user must have the role 'medecin'.")


    def __str__(self):
        return f"DPI: {self.id}"

