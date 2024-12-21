from django import forms
from django.forms import modelformset_factory
from .models import Medicament, Ordonnance

class MedicamentForm(forms.ModelForm):
    class Meta:
        model = Medicament
        fields = ['nom', 'duree', 'dose']  

class OrdonnanceForm(forms.ModelForm):
    class Meta:
        model = Ordonnance
        fields = ['duree']

    # Champ caché pour gérer dynamiquement les médicaments
    medicaments = forms.CharField(widget=forms.HiddenInput(), required=False)

    def save(self, commit=True):
        # Sauvegarder l'ordonnance
        ordonnance = super().save(commit=False)
        if commit:
            ordonnance.save()

        # Sauvegarder les médicaments associés
        medicaments_data = self.cleaned_data.get('medicaments')
        if medicaments_data:
            medicaments_list = medicaments_data.split(';')
            for medicament_data in medicaments_list:
                medicament_fields = medicament_data.split(',')
                if len(medicament_fields) == 3:  # Vérification pour éviter les erreurs de format
                    medicament = Medicament(
                        nom=medicament_fields[0],
                        duree=medicament_fields[1],
                        dose=medicament_fields[2],
                        dosePrise=0,
                        dosePrevues=0,
                        ordonnance=ordonnance
                    )
                    medicament.save()
                else:
                    # Gérer l'erreur si les données sont mal formatées
                    raise ValueError("Les données du médicament sont mal formatées.")
        return ordonnance

# Créer un formset pour gérer plusieurs médicaments
MedicamentFormSet = modelformset_factory(Medicament, form=MedicamentForm, extra=1)
