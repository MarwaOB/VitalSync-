from django import forms
from dpi.models import Antecedent
from django.forms import modelformset_factory

class AntecedentForm(forms.ModelForm):
    class Meta:
        model = Antecedent
        fields = ['titre', 'description', 'is_chirugical']

# Create the formset for Antecedent
AntecedentFormSet = modelformset_factory(
    Antecedent,
    form=AntecedentForm,
    extra=1  # Add one empty form by default for creating new antecedents
)
