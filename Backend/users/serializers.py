from rest_framework import serializers
from .models import (
    CustomUser,
    AdminCentral,
    AdminSys,
    Pharmacien,
    Medecin,
    Infermier,
    Radioloque,
    Biologiste,
    Laborantin,
    Patient,
)

# CustomUser Serializer
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'role',
            'NSS',
            'date_de_naissance',
            'adresse',
            'telephone',
            'mutuelle',
            'hospital',
        ]

# Proxy Model Serializers
class AdminCentralSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminCentral
        fields = CustomUserSerializer.Meta.fields

class AdminSysSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminSys
        fields = CustomUserSerializer.Meta.fields

class PharmacienSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pharmacien
        fields = CustomUserSerializer.Meta.fields

class MedecinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medecin
        fields = CustomUserSerializer.Meta.fields

class InfermierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Infermier
        fields = CustomUserSerializer.Meta.fields

class RadioloqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Radioloque
        fields = CustomUserSerializer.Meta.fields

class BiologisteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Biologiste
        fields = CustomUserSerializer.Meta.fields

class LaborantinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Laborantin
        fields = CustomUserSerializer.Meta.fields

# Patient Serializer
class PatientSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()  # Nested serializer for the related CustomUser instance

    class Meta:
        model = Patient
        fields = [
            'id',
            'user',
            'person_a_contacter_telephone',
            'date_debut_hospitalisation',
            'date_fin_hospitalisation',
            'dpi_null',
        ]

    def create(self, validated_data):
        """
        Create a Patient instance along with its associated CustomUser.
        """
        user_data = validated_data.pop('user')
        user = CustomUser.objects.create(**user_data)
        patient = Patient.objects.create(user=user, **validated_data)
        return patient

    def update(self, instance, validated_data):
        """
        Update a Patient instance and its associated CustomUser.
        """
        user_data = validated_data.pop('user', None)
        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
