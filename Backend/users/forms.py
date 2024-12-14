from django import forms
from dpi.models import Antecedent, Dpi
from users.models import CustomUser, Patient
from django.forms import modelformset_factory



class DpiForm(forms.ModelForm):
    patient = forms.ModelChoiceField(
        queryset=Patient.objects.filter(dpi_null = False),
        label="Patient",
        widget=forms.Select,
        required=True
    )
    medecin = forms.ModelChoiceField(
        queryset=CustomUser.objects.filter(role='medecin'),
        label="Doctor",
        widget=forms.Select,
        required=True
    )

    class Meta:
        model = Dpi
        fields = ['patient', 'medecin']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Customize patient dropdown
        self.fields['patient'].label_from_instance = lambda obj: f"{obj.user.first_name} {obj.user.last_name} - NSS: {obj.user.NSS}"
        # Customize doctor dropdown
        self.fields['medecin'].label_from_instance = lambda obj: f"{obj.first_name} {obj.last_name} - NSS: {obj.NSS}"

AntecedentFormSet = modelformset_factory(
    Antecedent,
    fields=('titre', 'description', 'is_chirugical'),
    extra=1
)
