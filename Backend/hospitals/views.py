from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Hospital
from .serializers import HospitalSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from dpi.serializers import DpiSerializer
from rest_framework.response import Response
from rest_framework import status
@api_view(['GET'])
def show_Hospitals(request):
    try:
        # Retrieve all hospitals
        hospitals = Hospital.objects.all()
       # print(f"hospitals: {hospitals}")  # Print the queryset for debugging

        # Serialize the hospital data
        serializer = HospitalSerializer(hospitals, many=True)
       # print(f"hospitals: {serializer.data}")  # Print the serialized data for debugging

        # Return the serialized data in the response
        return Response({"hospitals": serializer.data}, status=status.HTTP_200_OK)

    except Exception as e:
        # Handle any unexpected errors
        return Response(
            {"error": "An error occurred while retrieving hospitals", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensures only authenticated users can access this API
def add_hospital(request):
    try:

        # Extract and validate the data from the request
        data = request.data

        nom = data.get('nom')
        lieu = data.get('lieu')
        dateCreation = data.get('dateCreation')
        username = data.get('username')
        password = data.get('password')
        nombrePersonnels = data.get('nombrePersonnels')
        nombrePatients = data.get('nombrePatients')
        is_clinique = data.get('is_clinique')

        print(f"Newhospitals: {data.get('dateCreation')}")  # Print the queryset for debugging

  
        print("hospital:before el karita ") 
        # Print the queryset for debugging


        # Create the hospital
        hospital = Hospital.objects.create(
            nom=nom,
            lieu=lieu,
            is_clinique=is_clinique,
            nombrePersonnels = nombrePersonnels,
            nombrePatients = nombrePatients,
            dateCreation=dateCreation

        )
        print(f"hospital: {hospital}")  # Print the queryset for debugging

        # Create the user and link to the hospital
        user = CustomUser.objects.create_user(
            username=username,
            password=password,
            role="adminSys",
        )
        user.hospital = hospital
        user.save()

        # Serialize and return the created data
        hospital_serializer = HospitalSerializer(hospital)
        #user_serializer = CustomUserSerializer(user)

        return Response(
            {
                "message": "Hospital and user created successfully.",
                "hospital": hospital_serializer.data,
                #"user": user_serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        logging.error(f"Error creating hospital or user: {e}")
        return Response(
            {"error": "An error occurred while creating the hospital or user.", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

        
@api_view(['GET'])
def show_dpi(request):
    try:
        if request.user.role == "medecin":
            # Get all patients with dpi_null set to True
            dpis = Dpi.objects.filter(medecin=request.user)
        else:
            dpis = Dpi.objects.filter(medecin__hospital=request.user.hospital)

        # Serialize the patient data
        serializer = DpiSerializer(dpis, many=True)

        # Return the serialized data in the response
        return Response({"dpis": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": "An error occurred while retrieving dpis.", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
