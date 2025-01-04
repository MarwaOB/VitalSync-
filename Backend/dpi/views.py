import logging, qrcode
from rest_framework.decorators import api_view ,permission_classes
from django.shortcuts import render, redirect, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from users.models import CustomUser, Patient
from .models import  Dpi, Antecedent, Consultation, Biologique, Radiologique, Examen
from users.forms import AntecedentFormSet, DpiForm  # Import the formset
from django.contrib import messages
from django.utils.datastructures import MultiValueDictKeyError
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from .serializers import DpiSerializer ,AntecedentSerializer ,ConsultationSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from rest_framework.permissions import IsAuthenticated

@login_required
@csrf_exempt
def ajouter_consultation(request, dpi_id):
    dpi = get_object_or_404(Dpi, id=dpi_id)
    message = None  # Default message is None

    try:
        current_date = timezone.now().date()
        # Check for duplicate consultation
        if Consultation.objects.filter(date=current_date, dpi=dpi).exists():
            message = "Une consultation à la même date pour ce patient existe déjà."
            return render(request, 'dpiShow.html', {'dpi': dpi, 'message': message})

        # Create the consultation
        consultation = Consultation.objects.create(date=current_date, dpi=dpi)

    except MultiValueDictKeyError as e:
        missing_field = str(e)
        message = f"Le champ '{missing_field}' est obligatoire."
        return render(request, 'dpiShow.html', {'dpi': dpi, 'message': message})

    return render(request, 'dpiShow.html', {'dpi': dpi, 'message': message})
# Configure logging
logger = logging.getLogger(__name__)


@csrf_exempt
@login_required
def ajouter_biologique_bilan(request, consultation_id):
    logger.debug(f"Entering ajouter_biologique_bilan with consultation_id={consultation_id}")
    
    consultation = get_object_or_404(Consultation, id=consultation_id)
    logger.debug(f"Fetched consultation: {consultation}")

    if consultation.bilanBiologique is not None:
        logger.warning("Biologique Bilan already exists for this consultation.")
        messages.error(request, "A Biologique Bilan already exists for this consultation.")
        return redirect("consultation_detail", consultation_id=consultation.id)

    if request.method == "POST":
        logger.info("Creating a new Biologique Bilan")
        
        bilanBiologique =  Biologique.objects.create() 
        consultation.bilanBiologique = bilanBiologique  
        consultation.save()
       
        messages.success(request, "Biologique Bilan created successfully.")
        logger.info(f"Biologique Bilan created successfully for consultation_id={consultation.id}")
        return redirect("consultation_detail", consultation_id=consultation.id)

    logger.debug("Rendering ajouter_biologique_bilan template")
    return render(request, "consultation_detail.html", {"consultation": consultation})

@csrf_exempt
@login_required
def ajouter_examen(request, consultation_id):
    if request.method == 'POST':
        # Récupérer les données envoyées via le formulaire
        compte_rendu_list = request.POST.getlist('compte_rendu[]')  # List of compte_rendu fields
        image_list = request.FILES.getlist('image[]')  # List of image fields
        type_examen_list = request.POST.getlist('type_examen[]')  # List of type_examen fields

        # Récupérer l'objet Consultation correspondant
        consultation = get_object_or_404(Consultation, id=consultation_id)

        # Vérifier ou créer le Bilan radiologique associé à la consultation
        bilan_radiologique = consultation.bilanRadiologique
        if not bilan_radiologique:
            bilan_radiologique = Radiologique.objects.create(
                radioloque=request.user,
                date=request.POST.get('date')
            )
            consultation.bilanRadiologique = bilan_radiologique
            consultation.save()

        bilan_radiologique.radioloque = request.user
        bilan_radiologique.save()

        # Créer un nouvel objet Examen pour chaque examen dans les données
        for compte_rendu, image, type_examen in zip(compte_rendu_list, image_list, type_examen_list):
            Examen.objects.create(
                type=type_examen,
                description=compte_rendu,
                images=image,
                bilan_radiologique=bilan_radiologique
            )

        # Redirection vers la page des détails de la consultation (ou du DPI)
        return redirect('consultation_detail', consultation_id=consultation.id)


@csrf_exempt
@login_required
def ajouter_radiologique_bilan(request, consultation_id):
    consultation = get_object_or_404(Consultation, id=consultation_id)

    if consultation.bilanRadiologique is not None:
        messages.error(request, "Un bilan radiologique existe déjà pour cette consultation.")
        return redirect("consultation_detail", consultation_id=consultation.id)

    if request.method == "POST":
        # Create the Radiologique bilan and associate it with the consultation
        bilan_radiologique = Radiologique.objects.create()
        consultation.bilanRadiologique = bilan_radiologique
        consultation.save()

        messages.success(request, "Bilan radiologique créé avec succès.")
        return redirect("consultation_detail", consultation_id=consultation.id)

    return render(request, "consultation_detail.html", {"consultation": consultation})

@csrf_exempt
def consultation_detail(request, consultation_id):
    # Fetch the consultation or return a 404 error if it doesn't exist
    consultation = get_object_or_404(Consultation, id=consultation_id)

    context = {
        "consultation": consultation,
        "bilan_biologique": consultation.bilanBiologique,
        "bilan_radiologique": consultation.bilanRadiologique,
    }

    return render(request, "consultation_detail.html", context)
@csrf_exempt
@login_required
def ajouter_diagnostic(request, consultation_id):
    # Retrieve consultation by ID or handle missing consultation
    consultation = get_object_or_404(Consultation, id=consultation_id)

    return render(request, 'ajouter_diagnostic.html', {
        'consultation_id': consultation.id,  # Pass the consultation ID to the template
    })


@csrf_exempt
@login_required
def ajouter_resume(request, consultation_id):
    if request.method == 'POST':
        # Récupérer les données envoyées via le formulaire
        type_antecedant = request.POST.getlist('type_antecedant[]')  # Liste des types d'antécédents
        titre_antecedant = request.POST.getlist('titre[]')  # Liste des titres d'antécédents
        description_antecedant = request.POST.getlist('description[]')  # Liste des descriptions d'antécédents
        resume = request.POST.get('resume')  # Récupérer le résumé
        print(f"POST Data: {request.POST}")
        print(f"type_antecedant: {type_antecedant}")
        print(f"titre_antecedant: {titre_antecedant}")
        print(f"description_antecedant: {description_antecedant}")

        # Vérifier les données
        print(f"type_antecedant: {type_antecedant}")
        print(f"titre_antecedant: {titre_antecedant}")
        print(f"description_antecedant: {description_antecedant}")
        print(f"resume: {resume}")

        # Récupérer l'objet Consultation correspondant
        consultation = get_object_or_404(Consultation, id=consultation_id)
        
        if resume:
            consultation.resume = resume
            consultation.save()

        dpi = consultation.dpi 

        # Boucle pour créer les antécédents
        for titre, description, type_antecedant in zip(titre_antecedant, description_antecedant, type_antecedant):
            if not titre or not description:
                continue  # S'il manque un titre ou une description, on saute cet antécédent
            
            is_chirurgical = (type_antecedant == 'Chirurgical')  # Vérifier si l'antécédent est chirurgical
            print(f"is_chirurgical: {is_chirurgical}")
            # Créer un antécédent dans la base de données
            Antecedent.objects.create(
                titre=titre,
                description=description,
                is_chirugical=is_chirurgical,
                dpi=dpi,
            )

        # Redirection vers la page des détails de la consultation (ou du DPI)
        return redirect('consultation_detail', consultation_id=consultation.id)
               

@api_view(['GET'])
def show_dpi(request):
    try:
        # Initialize the list of DPIs
        dpis = []
        print(f'request.user.role: {request.user.role}')
        if request.user.role == "medecin":
            # Get all DPIs for the logged-in medecin
            dpis = Dpi.objects.filter(medecin=request.user)

        elif request.user.role == "radioloque":
            # Filter DPIs with pending radiological bilans
            user_hospital = request.user.hospital
            dpis = Dpi.objects.filter(medecin__hospital=user_hospital)
            dpis_with_pending_bilan = []
            for dpi in dpis:
                last_consultation_with_bilan = dpi.consultations.filter(bilanRadiologique__isnull=False).last()
                if last_consultation_with_bilan and last_consultation_with_bilan.bilanRadiologique.radioloque is None:
                    dpis_with_pending_bilan.append(dpi)
            dpis = dpis_with_pending_bilan

        elif request.user.role == "laborantin":
            # Filter DPIs with pending biological bilans
            user_hospital = request.user.hospital
            dpis = Dpi.objects.filter(medecin__hospital=user_hospital)
            dpis_with_pending_bilan = []
            for dpi in dpis:
                last_consultation_with_bilan = dpi.consultations.filter(bilanBiologique__isnull=False).last()
                if last_consultation_with_bilan and last_consultation_with_bilan.bilanBiologique.laborantin is None:
                    dpis_with_pending_bilan.append(dpi)
            dpis = dpis_with_pending_bilan

        elif request.user.role == "adminSys":
            # Get all DPIs for the adminSys role
            dpis = Dpi.objects.filter(medecin__hospital=request.user.hospital)
            print(f'dpis admin sys : {dpis}')

        # Serialize the DPI data
        serializer = DpiSerializer(dpis, many=True)

        # Return the serialized data in the response
        return Response({"dpis": serializer.data}, status=status.HTTP_200_OK)

    except Exception as e:
        # Return an error response in case of an exception
        return Response(
            {"error": "An error occurred while retrieving DPIs.", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
              

@api_view(['GET'])
def show_antecedant(request, patient_id):
    try:
        # Get patient using the patient_id from the URL
        patient = Patient.objects.get(id=patient_id)

        # Get the DPI associated with the patient
        dpi = Dpi.objects.get(patient=patient)

        # Get antecedents associated with the DPI
        antecedents = Antecedent.objects.filter(dpi=dpi)

        # Serialize the antecedents
        serializer = AntecedentSerializer(antecedents, many=True)

        # Return the serialized data in the response
        return Response({"antecedents": serializer.data, "dpi_id": dpi.id}, status=status.HTTP_200_OK)

    except Patient.DoesNotExist:
        return Response({"error": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)
    except Dpi.DoesNotExist:
        return Response({"error": "No DPI found for this patient."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": "An error occurred.", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



              
@api_view(['GET'])
def show_dpi_by_patient(request):
    try:
        dpi_id = 3
        if not dpi_id:
            return Response({"error": "L'ID du Dpi est requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            dpi = Dpi.objects.get(id=dpi_id)
        except dpi.DoesNotExist:
            return Response({"error": "dpi introuvable avec l'ID spécifié."}, status=status.HTTP_404_NOT_FOUND)

        serializer = DpiSerializer(dpi, many=True)
        print(f'Dpi {serializer.data}')

        # Return the serialized data in the response
        return Response({"Dpi": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": "An error occurred while retrieving antecedents.", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def ajouter_antecedant_api(request):
    try:
        titre = request.data.get('titre')
        description = request.data.get('description')
        is_chirugical = request.data.get('is_chirugical')
        dpi_id = request.data.get('dpi_id')
        if not dpi_id:
            return Response({"error": "L'ID du Dpi est requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            dpi = Dpi.objects.get(id=dpi_id)
        except dpi.DoesNotExist:
            return Response({"error": "dpi introuvable avec l'ID spécifié."}, status=status.HTTP_404_NOT_FOUND)
        
        # Crear l'antecedant 
        antecedant = Antecedent.objects.create(
            titre=titre,
            description =description,
            is_chirugical=is_chirugical, 
            dpi=dpi
            )
     
        return Response(
            {'status': 'success', 'message': 'Antecedant created successfully.', 'antecedant.id': antecedant.id},
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {'status': 'error', 'message': 'An error occurred.', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def ajouter_Consultation_api(request):
    try:
        # Extract dpi_id from the request data
        dpi_id = request.data.get('dpi_id')
        if not dpi_id:
            return Response(
                {"error": "L'ID du Dpi est requis."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the specified Dpi exists
        try:
            dpi = Dpi.objects.get(id=dpi_id)
        except Dpi.DoesNotExist:
            return Response(
                {"error": "Dpi introuvable avec l'ID spécifié."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get the current date
        current_date = timezone.now().date()

        # Check for duplicate consultation on the same date
        if Consultation.objects.filter(date=current_date, dpi=dpi).exists():
            return Response(
                {"error": "Une consultation à la même date pour ce patient existe déjà."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the consultation
        consultation = Consultation.objects.create(date=current_date, dpi=dpi)

        return Response(
            {
                'status': 'success',
                'message': 'Consultation created successfully.',
                'consultation_id': consultation.id
            },
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {'status': 'error', 'message': 'An error occurred.', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
@api_view(['GET'])
def show_consultations(request,patient_id):
    try:
        # Extract patient_id from query parameters (for GET requests)
      
        if not patient_id:
            return Response({"error": "L'ID du patient est requis."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the specified Patient exists
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return Response({"error": "Patient introuvable avec l'ID spécifié."}, status=status.HTTP_404_NOT_FOUND)

        # Get the DPI associated with the patient (assuming only one DPI per patient)
        try:
            dpi = Dpi.objects.get(patient=patient)
        except Dpi.DoesNotExist:
            return Response({"error": "Aucun DPI trouvé pour ce patient."}, status=status.HTTP_404_NOT_FOUND)

        # Fetch consultations related to the specified DPI
        consultations = Consultation.objects.filter(dpi=dpi)

        # If no consultations are found, handle that case
        if not consultations:
            return Response({"message": "Aucune consultation trouvée pour ce DPI."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the consultation data
        serializer = ConsultationSerializer(consultations, many=True)
        
        # Return the serialized data in the response
        return Response({"consultations": serializer.data, "dpi_id": dpi.id}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": "An error occurred while retrieving consultations.", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
