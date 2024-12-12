from django.db import models

class Hospital(models.Model):
    nom = models.CharField(max_length=50,default='')
    lieu = models.TextField(default='')
    dateCreation = models.DateField(default="2024-01-01")
    nombrePatients = models.IntegerField(default=0)
    nombrePersonnels = models.IntegerField(default=0)
    is_clinique = models.BooleanField(default=False)  # False = Hopital, True = Clinique


def __str__(self):
        return f"{self.id} ({self.nom})"