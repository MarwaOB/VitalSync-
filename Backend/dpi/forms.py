from django import forms
from django.forms import modelformset_factory
from .models import Medicament, Ordonnance
from decimal import Decimal
from django. shortcuts import render 
from django.http import HttpResponse
from django. template. loader import get_template 
from xhtml2pdf import pisa

# Définition globale des choix de mode d'administration
MODE_ADMINISTRATION_CHOICES = [
    ('IM', 'Intramusculaire'),
    ('IV', 'Intraveineuse'),
    ('SC', 'Sous-cutanée'),
    ('ID', 'Intradermique'),
    ('PO', 'Orale'),
    ('PR', 'Rectale'),
    ('PV', 'Vaginale'),
    ('INH', 'Par inhalation'),
    ('NAS', 'Nasale'),
    ('TOP', 'Topique (locale)'),
    ('OC', 'Oculaire'),
    ('AU', 'Auriculaire'),
    ('SL', 'Sublinguale'),
    ('BUCC', 'Buccale'),
    ('TD', 'Transdermique'),
]
UNITE_CHOICES = [

        ("mg", "Milligramme"),
        ("mcg", "Microgramme"),
        ("g", "Gramme"),
        ("ml", "Millilitre"),
        ("l", "Litre"),
        ("cl", "Centilitre"),
        ("ng", "Nanogramme"),
        ("pg", "Picogramme"),
        ("cp", "Comprimé"),
        ("gél", "Gélule"),
        ("flacon", "Flacon"),
        ("sachet", "Sachet"),
        ("caps", "Capsule"),
        ("pce", "Pièce"),
        ("ml", "Millilitre"),
        ("cuillère café", "Cuillère à café (~5 ml)"),
        ("cuillère soupe", "Cuillère à soupe (~15 ml)"),
        ("gouttes", "Gouttes"),
        ("amp", "Ampoule"),
        ("UI", "Unité Internationale"),
        ("spray", "Pulvérisation"),
        ("patch", "Patch"),
        ("suppositoire", "Suppositoire"),
        ("%", "Pourcentage"),
        ("ppm", "Parties par Million"),

    ]


class MedicamentForm(forms.ModelForm):
   

    class Meta:
        model = Medicament
        fields = ['nom', 'duree','frequence', 'dose' , 'unite', 'qte', 'mode_administration','observation']



class OrdonnanceForm(forms.ModelForm):
    class Meta:
        model = Ordonnance
        fields = ['observation']

    medicaments = forms.CharField(widget=forms.HiddenInput(), required=False)
    mode_administration = forms.ChoiceField(choices=MODE_ADMINISTRATION_CHOICES, required=False)
    unite = forms.ChoiceField(choices=UNITE_CHOICES, required=False)
    def save(self, commit=True):
        ordonnance = super().save(commit=False)
        max_duree = 0

        if commit:
            ordonnance.save()
            
        medicaments_data = self.cleaned_data.get('medicaments')
        if medicaments_data:
            medicaments_list = medicaments_data.split(';')
            for medicament_data in medicaments_list:
                medicament_fields = medicament_data.split(',')
                duree_medicament = int(medicament_fields[1])
                if duree_medicament > max_duree:
                    max_duree = duree_medicament
                if len(medicament_fields) == 8:  
                    observation = medicament_fields[7] if len(medicament_fields) > 7 else None  # Vérification si l'observation existe
                    dose = Decimal(medicament_fields[3])
                    if dose == dose.to_integral_value():
                         dose = int(dose) 
                    medicament = Medicament(
                        nom=medicament_fields[0],
                        duree=int(medicament_fields[1]),
                        frequence=int(medicament_fields[2]),
                        dose=dose,
                        unite=medicament_fields[4],
                        qte= int(medicament_fields[5]),
                        mode_administration=medicament_fields[6],
                        dosePrise=0,
                        dosePrevues=Decimal(medicament_fields[1]) * Decimal(medicament_fields[3]) * Decimal (medicament_fields[2]),
                        ordonnance=ordonnance,
                        observation=observation,
                    )
                    medicament.save()
                else:
                    # Gérer l'erreur si les données sont mal formatées
                    raise ValueError("Les données du médicament sont mal formatées.")
        ordonnance.duree= max_duree    
        ordonnance.save()
        return ordonnance

# Créer un formset pour gérer plusieurs médicaments
MedicamentFormSet = modelformset_factory(Medicament, form=MedicamentForm, extra=1)



