from rest_framework import serializers
from .models import (
    Antecedent,
    Dpi,
    Biologique,
    Radiologique,
    Examen,
    Diagnostic,
    Ordonnance,
    Medicament,
    Consultation,
)
from users.models import Patient, CustomUser


# Antecedent Serializer
class AntecedentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Antecedent
        fields = ['id', 'titre', 'description', 'is_chirugical', 'dpi']


# Dpi Serializer
class DpiSerializer(serializers.ModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())
    medecin = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(role='medecin'))

    class Meta:
        model = Dpi
        fields = ['id', 'QR_Code', 'patient', 'medecin']

    def create(self, validated_data):
        instance = super().create(validated_data)
        instance.save()  # Ensure QR code generation logic is executed
        return instance


# Biologique Serializer
class BiologiqueSerializer(serializers.ModelSerializer):
    laborantin = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(role='laborantin'))

    class Meta:
        model = Biologique
        fields = [
            'id', 'bilan_type', 'date', 'laborantin', 'description',
            'tauxGlycemie', 'tauxPressionArterielle', 'tauxCholesterol'
        ]


# Radiologique Serializer
class RadiologiqueSerializer(serializers.ModelSerializer):
    radioloque = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(role='radioloque'))

    class Meta:
        model = Radiologique
        fields = ['id', 'bilan_type', 'date', 'radioloque']


# Examen Serializer
class ExamenSerializer(serializers.ModelSerializer):
    bilan_radiologique = serializers.PrimaryKeyRelatedField(queryset=Radiologique.objects.all())

    class Meta:
        model = Examen
        fields = ['id', 'type', 'description', 'images', 'bilan_radiologique']


# Diagnostic Serializer
class DiagnosticSerializer(serializers.ModelSerializer):
    ordonnance = serializers.PrimaryKeyRelatedField(queryset=Ordonnance.objects.all(), required=False)

    class Meta:
        model = Diagnostic
        fields = ['id', 'ordonnance']


# Ordonnance Serializer
class OrdonnanceSerializer(serializers.ModelSerializer):
    diagnostic = serializers.PrimaryKeyRelatedField(queryset=Diagnostic.objects.all())
    meds = serializers.PrimaryKeyRelatedField(queryset=Medicament.objects.all(), many=True)

    class Meta:
        model = Ordonnance
        fields = ['id', 'diagnostic', 'duree', 'is_valid', 'meds']


# Medicament Serializer
class MedicamentSerializer(serializers.ModelSerializer):
    ordonnance = serializers.PrimaryKeyRelatedField(queryset=Ordonnance.objects.all())

    class Meta:
        model = Medicament
        fields = '__all__'


# Consultation Serializer
class ConsultationSerializer(serializers.ModelSerializer):
    dpi = serializers.PrimaryKeyRelatedField(queryset=Dpi.objects.all())
    diagnostic = DiagnosticSerializer(required=False)
    bilanBiologique = BiologiqueSerializer(required=False)
    bilanRadiologique = RadiologiqueSerializer(required=False)

    class Meta:
        model = Consultation
        fields = [
            'id', 'date', 'dpi', 'resume', 'diagnostic', 'bilanBiologique',
            'is_bilanBiologique_fait', 'is_bilanRadiologique_fait', 'bilanRadiologique',
            'grapheBiologique',
        ]

    def validate(self, data):
        """
        Custom validation to ensure only 0-2 bilans or a diagnostic.
        """
        if (data.get('bilanBiologique') or data.get('bilanRadiologique')) and data.get('diagnostic'):
            raise serializers.ValidationError(
                "A consultation can only have bilans or a diagnostic, not both."
            )
        return data
