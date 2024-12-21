from django import forms
from dpi.models import Dpi, Antecedent
from users.models import CustomUser, Patient
from django.forms import modelformset_factory


class DpiForm(forms.ModelForm):
    patient = forms.ModelChoiceField(
        queryset=Patient.objects.none(),
        label="Patient",
        widget=forms.Select,
        required=True
    )
    medecin = forms.ModelChoiceField(
        queryset=CustomUser.objects.none(),
        label="Médecin",
        widget=forms.Select,
        required=False  # Non obligatoire car peut être omis si c'est un médecin qui crée le DPI
    )

    class Meta:
        model = Dpi
        fields = ['patient', 'medecin']

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)  # L'utilisateur qui crée le DPI
        super().__init__(*args, **kwargs)

        if user:
            # Restreindre les patients au même hôpital
            self.fields['patient'].queryset = Patient.objects.filter(user__hospital=user.hospital, dpi_null=True)
            self.fields['patient'].label_from_instance = lambda obj: f"{obj.user.first_name} {obj.user.last_name} - NSS: {obj.user.NSS}"

            # Restreindre les médecins au même hôpital si c'est un admin
            if user.role == 'adminSys':
                self.fields['medecin'].queryset = CustomUser.objects.filter(hospital=user.hospital, role='medecin')
                self.fields['medecin'].label_from_instance = lambda obj: f"{obj.first_name} {obj.last_name} - NSS: {obj.NSS}"
            elif user.role == 'medecin':
                # Si le médecin crée le DPI, cacher le champ médecin
                self.fields.pop('medecin')



AntecedentFormSet = modelformset_factory(
    Antecedent,
    fields=('titre', 'description', 'is_chirugical'),
    extra=1
)



  