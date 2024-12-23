from rest_framework import serializers
from .models import Hospital

class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = ['id', 'nom', 'lieu', 'dateCreation', 'nombrePatients', 'nombrePersonnels', 'is_clinique']
    
    # Field-level validation for nombrePatients
    def validate_nombrePatients(self, value):
        if value < 0:
            raise serializers.ValidationError("The number of patients cannot be negative.")
        return value
    
    # Field-level validation for nombrePersonnels
    def validate_nombrePersonnels(self, value):
        if value < 0:
            raise serializers.ValidationError("The number of personnel cannot be negative.")
        return value
    
    # Object-level validation
    def validate(self, data):
        if data['is_clinique'] and data['nombrePatients'] > 50:
            raise serializers.ValidationError("Clinics cannot have more than 50 patients.")
        return data
