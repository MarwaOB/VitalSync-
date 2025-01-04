


import logging, qrcode
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.decorators import api_view
from django.shortcuts import render, redirect, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser, Hospital, Patient
from dpi.models import  Dpi, Antecedent, Consultation
from .forms import AntecedentFormSet, DpiForm , BilanForm # Import the formset
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from pyzbar.pyzbar import decode
from django.core.files.storage import FileSystemStorage
from django.db.models import Max
import io
from io import BytesIO
import matplotlib.pyplot as plt
import base64
from django.core.files.base import ContentFile
from django.http import JsonResponse
from django.contrib.auth import logout
from rest_framework.permissions import IsAuthenticated
from .serializers import PatientSerializer ,CustomUserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import qrcode
from django.db import models
from users.models import Patient
from io import BytesIO
from django.core.files import File
from PIL import Image
from django.core.mail import EmailMessage
from django.conf import settings
from django.core.exceptions import ValidationError
import requests

@csrf_exempt


@csrf_exempt
@login_required
def add_hospital(request):

    if request.method == 'POST':
        nom = request.POST['name']
        lieu = request.POST['lieu']
        type = request.POST['type']
        
        # Validate 'type'
        if type.lower() not in ['hopital', 'clinique']:
            return HttpResponse("Invalid type. Please select 'Hôpital' or 'Clinique'.", status=400)
        
        is_clinique = type.lower() == 'clinique'
        date_de_creation = request.POST['date_de_creation']

        username = request.POST['username']
        password = request.POST['password']
        role = 'adminSys'
        date_de_naissance = request.POST['date_de_naissance']
        adresse = request.POST['adresse']
        telephone = request.POST['telephone']
        mutuelle = request.FILES.get('mutuelle', None)  # Get the uploaded PDF file if any

        try:
            # Create hospital
            hospital = Hospital.objects.create(
                nom=nom,
                lieu=lieu,
                is_clinique=is_clinique,
                dateCreation=date_de_creation,
            )
            
            # Create user and link to hospital
            user = CustomUser.objects.create_user(
                username=username,
                password=password,
                role="adminSys",
                date_de_naissance=date_de_naissance,
                adresse=adresse,
                telephone=telephone,
                mutuelle=mutuelle,
            )
            user.hospital = hospital
            user.save()

            return redirect('adminCentral')
        except Exception as e:
            logging.error(f"Error creating hospital or user: {e}")
            return HttpResponse("An error occurred. Please check your input and try again.", status=500)
    
    return render(request, 'adminCentral.html')

@csrf_exempt
@login_required
def add_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        NSS = request.POST['NSS']
        last_name = request.POST['last_name']
        first_name = request.POST['first_name']
        role = request.POST['role']
        date_de_naissance = request.POST['date_de_naissance']
        adresse = request.POST['adresse']
        telephone = request.POST['telephone']
        email = request.POST['email']

        mutuelle = request.POST.get('mutuelle', '')

        if CustomUser.objects.filter(username=username).exists():
            messages.error(request, "Le nom d'utilisateur existe déjà.")
            return redirect('add_user')  

        if CustomUser.objects.filter(telephone=telephone).exists():
            messages.error(request, "Le numéro de téléphone est déjà utilisé.")
            return redirect('add_user') 
        
       # if CustomUser.objects.filter(email=telephone).exists():
        #    messages.error(request, "L'email est déjà utilisé.")
         #   return redirect('add_user') 


        user = CustomUser.objects.create_user(
            username=username,
            password=password,
            NSS=NSS,
            first_name=first_name,
            last_name=last_name,
            role=role,
            date_de_naissance=date_de_naissance,
            adresse=adresse,
            telephone=telephone,
            mutuelle=mutuelle,
            email=email,
            hospital=request.user.hospital,
        )

        # Handle patient-specific fields
        if role == 'patient':
            contact_person = request.POST.get('contact_person', '')
            
            patient = Patient.objects.create(
                user=user,
                person_a_contacter_telephone=[contact_person],
            )
      
            return redirect('adminSys')  # Redirect to appropriate page for non-patient roles

    return render(request, 'adminSys.html')
@csrf_exempt
def sign_in(request):
    if request.method == "POST":
        try:
            # Parse JSON request body
            import json
            body = json.loads(request.body.decode('utf-8'))
            username = body.get('username')
            password = body.get('password')
            print(f"Received data: {username}, {password}")
            
            # Authenticate user
            user = authenticate(request, username=username, password=password)
            print(f"User after authentication: {user}")
            
            if user is not None:
                print(f"user is not None")
                role = user.role
                print(f"Role: {role}")
                login(request, user)
                
                user_data = {
                    'nss' : user.NSS ,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role,
                    'date_de_naissance': user.date_de_naissance.isoformat() if user.date_de_naissance else None,
                    'adresse': user.adresse,
                    'telephone': user.telephone,
                    'mutuelle': user.mutuelle.url if user.mutuelle else None,
                    'hospital': {
                        'name': user.hospital.nom,
                        'location': user.hospital.lieu,
                        'id': user.hospital.id
                    } if user.hospital else None,
                }
                print(f"User data: {user_data}")

                # Return JSON response based on role
                role_redirects = {
                    'adminCentral': 'admin_Central_Home',
                    'adminSys': 'admin_Sys_Home',
                    'medecin': 'medecin_Home',
                    'patient': 'show_dpi_by_patient',
                    'infermier': 'infermier',
                    'radioloque': 'radiologueHome',
                    'laborantin': 'laborantinHome',
                    'pharmacien': 'pharmacien',
                }
                
                if role in role_redirects:
                    print(f"Redirecting to: {role_redirects[role]}")

                    return JsonResponse({'status': 'success', 'user_data': user_data, 'redirect_url': role_redirects[role]}, status=200)
                else:
                    print("Role not defined in redirects")
                    return JsonResponse({'status': 'error', 'message': 'Role non défini'}, status=400)
            else:
                print("Authentication failed")
                return JsonResponse({'status': 'error', 'message': "Nom d'utilisateur ou mot de passe incorrect."}, status=400)
        
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


@login_required
def admincentral(request):
    return render(request, 'adminCentral.html')

@login_required
def adminsys(request):
    return render(request, 'adminSys.html')

@login_required
def creerDPI(request):
    if request.method == 'POST':
        dpi_form = DpiForm(request.POST, user=request.user)
        formset = AntecedentFormSet(request.POST)

        if dpi_form.is_valid() and formset.is_valid():
            dpi = dpi_form.save(commit=False)

            # Associate the medecin if the user is a medecin
            if request.user.role == 'medecin':
                dpi.medecin = request.user

            dpi.save()

          

            # Save antecedents
            for form in formset:
                antecedent = form.save(commit=False)
                antecedent.dpi = dpi
                antecedent.save()

            return redirect('admin_Sys_Home' if request.user.role == 'adminSys' else 'medecin_Home')
        else:
            print("DPI form errors:", dpi_form.errors)
            print("Formset errors:", formset.errors)
    else:
        dpi_form = DpiForm(user=request.user)
        formset = AntecedentFormSet(queryset=Antecedent.objects.none())

    return render(request, 'creerDPI.html', {
        'dpi_form': dpi_form,
        'formset': formset,
    })


@csrf_exempt
@login_required
def medecin_Home(request):
    if request.method == "POST":
        action = request.POST.get("action")  

        if action == "show_dpis":
            try:
                medecin = request.user
                dpis = Dpi.objects.filter(medecin=medecin)
                return render(request, 'medecinShow.html', {
                    'dpis': dpis,
                })
            except ObjectDoesNotExist:
                raise Http404("No DPI found for this doctor.")
            
        elif action == "show_consultations":
            try:
                consultations = Consultation.objects.all()
                return render(request, "consultation_list.html", {"consultations": consultations})

            except ObjectDoesNotExist:
                raise Http404("No DPI found for this doctor.")
            
        elif action == "recherche_dpi_qrCode":
            # Redirect to a search page
            return redirect('rechercheDpi_qrcode')  

        elif action == "creer-dpi":
            # Redirect to a search page
            return redirect('creerDPI')  
            
        else:
            # Handle invalid action
            return HttpResponse("Invalid action", status=400)

    # If not a POST request, render the home page
    return render(request, 'medecinHome.html')


@csrf_exempt
@login_required
def admin_Sys_Home(request):
    if request.method == "POST":
        action = request.POST.get("action")  # Get the action value from the form submission

        if action == "add_user":
            return redirect('adminSys')  # Redirect to add user page
        elif action == "show_users":
            return redirect('show_users_by_hospital')  # Redirect to show users page
        else:
            # Handle the case where the action is not recognized
            return HttpResponse("Invalid action", status=400)

    return render(request, 'adminSysHome.html')

@csrf_exempt
@login_required
def show_dpi_by_patient(request):
        try:
            patient = Patient.objects.get(user=request.user)
            dpi = Dpi.objects.get(patient=patient)
            return render(request, 'dpiShow.html', {
                'patient': patient,
                'dpi': dpi,
                'antecedents': dpi.antecedents.all(),
            })
        except ObjectDoesNotExist:
            raise Http404("No DPI found for this patient.")

@login_required
def Consultation_dpi(request):
    if request.method == "GET":
        dpi_id = request.GET.get('dpi_id')
        try:
            dpi = Dpi.objects.get(id=dpi_id)  # Fetch DPI by its ID
            patient = dpi.patient  # Get the patient associated with the DPI
            return render(request, 'dpiShow.html', {
                'patient': patient,
                'dpi': dpi,
                'antecedents': dpi.antecedents.all(),
            })
        except Dpi.DoesNotExist:
            raise Http404("DPI not found.")

@csrf_exempt  
@login_required
def admin_Central_Home(request):
    if request.method == "POST":
        action = request.POST.get("action")  

        if action == "add_user":
            return redirect('adminCentral')  #
        elif action == "show_users":
            return redirect('show_hospital') 
        else:
            # Handle the case where the action is not recognized
            return HttpResponse("Invalid action", status=400)

    return render(request, 'adminCentralHome.html')

@csrf_exempt
@login_required
def show_users_by_hospital(request):
    user_hospital_id = request.user.hospital.id

    users_in_hospital = CustomUser.objects.filter(hospital__id=user_hospital_id)

    return render(request, 'adminSysShow.html', {'users': users_in_hospital})

@login_required
def show_hospital(request):
    hospitals = Hospital.objects.all()
    return render(request, 'adminCentralShow.html', {
        'hospitals': hospitals,
    })

@login_required
def admincentralShow(request):
    return render(request, 'adminCentralShow.html')

@login_required
def adminSysHome(request):
    return render(request, 'adminSysHome.html')

@login_required
def adminSysShow(request):
    return render(request, 'adminSysShow.html')  

    
@login_required
def radiologueHome(request):
    user_hospital = request.user.hospital
    dpis = Dpi.objects.filter(medecin__hospital=user_hospital)
    dpis_with_pending_bilan = []
    for dpi in dpis:
        last_consultation_with_bilan = dpi.consultations.filter(bilanRadiologique__isnull=False).last()
        if last_consultation_with_bilan:
            if last_consultation_with_bilan.bilanRadiologique.radioloque is None:
                dpis_with_pending_bilan.append(dpi)
          

    context = {
        'dpis': dpis_with_pending_bilan,
    }
    
    # Rendre la page avec les données filtrées
    return render(request, 'radiologueHome.html', context)
@csrf_exempt
@login_required
def laborantinHome(request):
    user_hospital = request.user.hospital
    dpis = Dpi.objects.filter(medecin__hospital=user_hospital)
    dpis_with_pending_bilan = []
    for dpi in dpis:
        last_consultation_with_bilan = dpi.consultations.filter(bilanBiologique__isnull=False).last()
        if last_consultation_with_bilan:
            if last_consultation_with_bilan.bilanBiologique.laborantin is None:
                dpis_with_pending_bilan.append(dpi)
          

    context = {
        'dpis': dpis_with_pending_bilan,
    }
    
    # Rendre la page avec les données filtrées
    return render(request, 'laborantinHome.html', context)


@login_required
def Consultation_dpi_Bilan(request):
    if request.method == "GET":
        dpi_id = request.GET.get('dpi_id')
        try:
            dpi = Dpi.objects.get(id=dpi_id)  # Récupérer le DPI par son ID
            patient = dpi.patient  # Obtenir le patient associé au DPI
            latest_consultation = dpi.consultations.order_by('-date').first()  # Dernière consultation par date
            return render(request, 'dpiShowBilan.html', {
                'patient': patient,
                'dpi': dpi,
                'latest_consultation': latest_consultation,
                'antecedents': dpi.antecedents.all(),
            })
        except Dpi.DoesNotExist:
            raise Http404("DPI not found.")
@csrf_exempt
@login_required
def faire_bilan(request, consultation_id):
    consultation = Consultation.objects.get(id=consultation_id)
    bilan = consultation.bilanBiologique

    if request.method == 'POST':
        form = BilanForm(request.POST)
        if form.is_valid():
            # Process the form data
            description = form.cleaned_data['description']
            taux1 = form.cleaned_data['taux1']
            taux2 = form.cleaned_data['taux2']
            taux3 = form.cleaned_data['taux3']
            date = form.cleaned_data['date']
            bilan.tauxGlycemie = taux1
            bilan.tauxPressionArterielle = taux2
            bilan.tauxCholesterol = taux3
            bilan.description = description
            bilan.laborantin = request.user
            bilan.date=date
            bilan.save()
            consultation.bilanBiologique = bilan
            consultation.is_bilanBiologique_fait = True
            consultation.save()

            return render(request, 'faire_bilan.html', {'form': form, 'consultation': consultation, 'graph_generated': False})
    else:
        form = BilanForm()

    return render(request, 'faire_bilan.html', {'form': form, 'consultation': consultation, 'graph_generated': False})

def generate_graph_view(request, consultation_id):
    consultation = Consultation.objects.get(id=consultation_id)
    taux1 = consultation.bilanBiologique.tauxGlycemie
    taux2 = consultation.bilanBiologique.tauxPressionArterielle
    taux3 = consultation.bilanBiologique.tauxCholesterol

    # Generate the graph
    graph_path = generate_graph(taux1, taux2, taux3, consultation)
    consultation.grapheBiologique = graph_path
    consultation.save()

    return render(request, 'graph_page.html', {'graph_url': consultation.grapheBiologique.url})

def generate_graph(taux1, taux2, taux3, consultation):
    import matplotlib
    matplotlib.use('Agg')  # Use non-interactive backend
    import matplotlib.pyplot as plt
    import io
    from django.core.files.images import ImageFile

    # Initialize data
    current_data = [taux1, taux2, taux3]
    previous_data = []

    # Fetch all consultations belonging to the same DPI
    consultations = consultation.dpi.consultations.filter(date__lt=consultation.date).order_by('-date')

    # Iterate through consultations to find the earliest with a valid bilanBiologique
    for previous_consultation in consultations:
        bilan = previous_consultation.bilanBiologique
        if bilan and bilan.tauxGlycemie is not None:
            previous_data = [
                bilan.tauxGlycemie,
                bilan.tauxPressionArterielle,
                bilan.tauxCholesterol
            ]
            break  # Stop iterating once a valid consultation is found

    # Generate the graph
    fig, ax = plt.subplots()

    # Plot the current data
    ax.bar([1, 2, 3], current_data, label='Nouveau Bilan')

    if previous_data:
        # Plot the previous data as stacked bars
        ax.bar([1, 2, 3], previous_data, bottom=current_data, label='Bilan Précédent')

    # Set custom x-axis labels
    ax.set_xticks([1, 2, 3])
    ax.set_xticklabels(['Glycémie', 'Pression Artérielle', 'Cholestérol'])
    ax.set_xlabel('Paramètres Mesurés')  # Title for the x-axis

    # Set labels and titles
    ax.set_ylabel('Taux')
    ax.set_title('Comparaison des Bilans')
    ax.legend()

    # Save the graph to an image file
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)

    # Save the image to the media directory
    filename = f'graphesBiologiques/graph_{consultation.id}.png'
    graph_path = consultation.grapheBiologique.storage.save(filename, ImageFile(buffer))

    # Close the plot
    plt.close(fig)

    return graph_path




@csrf_exempt
@login_required
def rechercheDpi_qrcode(request):
    if request.method == "POST" and request.FILES['qr_code']:
        qr_file = request.FILES['qr_code']
        
        # Ensure file is a valid image (QR codes are image-based)
        if qr_file.content_type not in ['image/png', 'image/jpeg', 'image/jpg']:
            messages.error(request, "Veuillez télécharger une image valide pour le QR code.")
            return redirect('rechercheDpi_qrcode')
        
        try:
            # Open the image file
            img = Image.open(qr_file)
            decoded_objects = decode(img)
            
            if not decoded_objects:
                messages.error(request, "Aucun QR code trouvé dans l'image téléchargée.")
                return redirect('rechercheDpi_qrcode')

            # Extract NSS from decoded QR code (assuming QR code contains the NSS directly)
            nss = decoded_objects[0].data.decode('utf-8')

            # Try to retrieve the patient based on the NSS
            user = CustomUser.objects.get(NSS=nss)
            patient = Patient.objects.get(user=user)

            # Retrieve the hospital of the current user
            current_user_hospital = request.user.hospital  # Adjust this line based on your model relationships

            # Filter DPIs by patient and hospital
            dpis = Dpi.objects.filter(patient=patient)

            if dpis.exists():
                return render(request, 'medecinShow.html', {'dpis': dpis})
            else:
                messages.error(request, "Aucun DPI trouvé pour ce patient dans votre hôpital.")
                return redirect('rechercheDpi_qrcode')

        except CustomUser.DoesNotExist:
            messages.error(request, "Aucun utilisateur trouvé avec ce NSS.")
            return redirect('rechercheDpi_qrcode')
        except Patient.DoesNotExist:
            messages.error(request, "Aucun patient trouvé avec ce NSS.")
            return redirect('rechercheDpi_qrcode')
        except Exception as e:
            logging.error(f"Erreur lors du traitement du QR code: {e}")
            messages.error(request, "Une erreur s'est produite lors de la lecture du QR code.")
            return redirect('rechercheDpi_qrcode')
    
    return render(request, 'rechercheDpi_qrcode.html')


@login_required
def dpi_list(request):
    nss = request.GET.get('nss')
    dpis = None
    message = None  

    if nss:
        try:
            user = CustomUser.objects.get(NSS=nss)
            patient = Patient.objects.get(user=user)
            dpis = Dpi.objects.filter(patient=patient)
    
            if not dpis.exists():
                message = "Aucun DPI trouvé pour ce NSS."
        except CustomUser.DoesNotExist:
            message = "Utilisateur introuvable pour ce NSS."
        except Patient.DoesNotExist:
            message = "Patient introuvable pour ce NSS."
    else:
        message = "Veuillez entrer un NSS valide."

    return render(request, 'medecinShow.html', {'dpis': dpis, 'message': message})

@csrf_exempt # You can remove this if you are using session-based authentication or have CSRF tokens in place 

def log_out(request):
    if request.method == "POST":
        try:
            logout(request)  # Logs out the user
            return JsonResponse({'status': 'success', 'message': 'Logged out successfully'}, status=200)
        except Exception as e:
            # Log the exception message for debugging
            print(f"Logout failed: {e}")
            return JsonResponse({'status': 'error', 'message': 'Internal server error'}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


@csrf_exempt 
@api_view(['GET'])
def show_patients(request):
    try:
        print(f'request.user.role {request.user.role}')
        # Get all patients based on the role of the authenticated user
        if request.user.role == "adminCentral":
            patients = Patient.objects.all()
        else:
            patients = Patient.objects.filter(user__hospital=request.user.hospital)

        print(f'patients {patients} ')

        # Serialize the patient data
        serializer = PatientSerializer(patients, many=True)

        # Return the serialized data in the response
        return Response({"patients": serializer.data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": "An error occurred while retrieving patients.", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@csrf_exempt 
@api_view(['GET'])
def list_users_by_role(request):
    if request.method == "GET":
        try:
            # Get the role from query parameters
            role = request.GET.get('role')
            if not role:
                return Response({'status': 'error', 'message': 'Role parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
                
            if request.user.role == "adminCentral":
                # Fetch users based on the role
                users = CustomUser.objects.filter(role=role)
            else:
                users = CustomUser.objects.filter(role=role, hospital=request.user.hospital)
            if not users.exists():
                return Response({'status': 'error', 'message': f'No users found for role: {role}'}, status=status.HTTP_404_NOT_FOUND)
            
            # Serialize the data
            serializer = CustomUserSerializer(users, many=True)
            return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'status': 'error', 'message': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Only authenticated users can access
def add_user_api(request):
    try:
        # Extract data from the request
        data = request.data
        username = data.get('username')
        password = data.get('password')
        NSS = data.get('NSS')
        last_name = data.get('last_name')
        first_name = data.get('first_name')
        role = data.get('role')
        date_de_naissance = data.get('date_de_naissance')
        adresse = data.get('adresse')
        telephone = data.get('telephone')
        email = data.get('email')
        mutuelle = request.FILES.get('mutuelle')  # Uploaded file
        hospital_id = data.get('hospital')  # Get the hospital ID

        # Validate the hospital_id
        if not hospital_id:
            return Response({"error": "L'ID de l'hôpital est requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            hospital = Hospital.objects.get(id=hospital_id)
        except Hospital.DoesNotExist:
            return Response({"error": "Hôpital introuvable avec l'ID spécifié."}, status=status.HTTP_404_NOT_FOUND)

        # Input validation
        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Le nom d'utilisateur existe déjà."}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(telephone=telephone).exists():
            return Response({"error": "Le numéro de téléphone est déjà utilisé."}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "L'email est déjà utilisé."}, status=status.HTTP_400_BAD_REQUEST)

        # Parse date_de_naissance
        try:
            date_de_naissance = datetime.strptime(date_de_naissance, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return Response({"error": "Date de naissance invalide. Utilisez le format YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user
        user = CustomUser.objects.create_user(
            username=username,
            password=password,
            NSS=NSS,
            first_name=first_name,
            last_name=last_name,
            role=role,
            date_de_naissance=date_de_naissance,
            adresse=adresse,
            telephone=telephone,
            mutuelle=mutuelle,
            email=email,
            hospital=hospital
        )

        # Handle patient-specific data
        if role == 'patient':
            contact_person = data.get('contact_person')
            if not contact_person:
                return Response({"error": "Le champ 'contact_person' est requis pour les patients."}, status=status.HTTP_400_BAD_REQUEST)
            Patient.objects.create(
                user=user,
                person_a_contacter_telephone=contact_person,
            )

        # Serialize and return the created user
        serializer = CustomUserSerializer(user)
        return Response(
            {"message": "Utilisateur créé avec succès.", "user": serializer.data},
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {"error": "Une erreur s'est produite lors de la création de l'utilisateur.", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def creer_dpi_api(request):
    try:
        patient_id = request.data.get('patient_id')
        medecin_id = request.data.get('medecin_id')

        if not patient_id or not medecin_id:
            return Response(
                {"error": "Les IDs du patient et du médecin sont requis."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            patient = Patient.objects.get(id=patient_id)
            medecin = CustomUser.objects.get(id=medecin_id)
        except (Patient.DoesNotExist, CustomUser.DoesNotExist) as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_404_NOT_FOUND
            )

        existing_dpi = Dpi.objects.filter(patient=patient).first()
        if existing_dpi:
            return Response(
                {"error": "Un DPI existe déjà pour ce patient.", "dpi_id": existing_dpi.id},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update the patient's DPI status
        patient.dpi_null = False
        patient.save()
        dpi = Dpi.objects.create(patient=patient, medecin=medecin)

        # Générer le QR Code
        if patient.user.NSS:
            qr_data = patient.user.NSS
            qr_img = qrcode.make(qr_data)
            qr_img = qr_img.convert('RGBA')

            canvas = Image.new('RGBA', (290, 290), (255, 255, 255, 255))
            qr_width, qr_height = qr_img.size
            canvas_width, canvas_height = canvas.size
            box = (
                (canvas_width - qr_width) // 2,
                (canvas_height - qr_height) // 2,
                (canvas_width + qr_width) // 2,
                (canvas_height + qr_height) // 2,
            )
            canvas.paste(qr_img, box, qr_img)

            buffer = BytesIO()
            canvas.save(buffer, format='PNG')
            filename = f'qr_code_{patient.user.NSS}.png'
            dpi.QR_Code.save(filename, File(buffer), save=True)

            # Envoyer un email avec le QR code
            if patient.user.email:
                subject = 'Votre QR Code'
                message = 'Veuillez trouver votre QR code attaché à cet email.'
                email = EmailMessage(subject, message, settings.EMAIL_HOST_USER, [patient.user.email])
                buffer.seek(0)
                email.attach(filename, buffer.read(), 'image/png')
                email.send()

            buffer.close()
            canvas.close()

        return Response(
            {'status': 'success', 'message': 'DPI créé avec succès.', 'dpi_id': dpi.id},
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {'status': 'error', 'message': 'Une erreur s\'est produite.', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@api_view(['GET'])
def show_patients_nodpi(request):
    try:
        print(f"user role show medecin  {request.user.role}")

        # Get all patients with dpi_null set to True
        patients = Patient.objects.filter(dpi_null=True, user__hospital=request.user.hospital)
        # Serialize the patient data
        serializer = PatientSerializer(patients, many=True)

        # Return the serialized data in the response
        return Response({"patients": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": "An error occurred while retrieving patients.", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def show_medecin_same_hospital(request):
    try:

        # Get all patients with dpi_null set to True
        medecin = CustomUser.objects.filter(hospital=request.user.hospital)

        # Serialize the patient data
        serializer = CustomUserSerializer(medecin, many=True)

        # Return the serialized data in the response
        return Response({"medecin": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": "An error occurred while retrieving medecins.", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Require authentication
def recherche_dpi_qrcode_api(request):
    # Get the QR code URL from query parameters
    qr_code_url = request.GET.get('qr_code_url')
    if not qr_code_url:
        return Response(
            {"error": "L'URL de l'image du QR code est requise."},
            status=400
        )
    
    try:
        # Download the image from the provided URL
        response = requests.get(qr_code_url)
        if response.status_code != 200:
            return Response(
                {"error": "Impossible de télécharger l'image depuis l'URL fournie."},
                status=400
            )
        
        # Load the image using PIL
        img = Image.open(BytesIO(response.content))

        # Decode the QR code
        decoded_objects = decode(img)
        if not decoded_objects:
            return Response(
                {"error": "Aucun QR code valide trouvé dans l'image."},
                status=400
            )

        # Extract NSS (assuming the QR code directly contains NSS data)
        nss = decoded_objects[0].data.decode('utf-8')
        user = CustomUser.objects.get(NSS=nss)
        patient = Patient.objects.get(user=user)
        dpi = Dpi.objects.get(patient = patient)

        return Response(
            {"status": "success", "dpi_id": dpi.id},
            status=200
        )

    except Exception as e:
        logging.error(f"Erreur lors du traitement du QR code : {e}")
        return Response(
            {"error": "Une erreur s'est produite lors du traitement du QR code."},
            status=500
        )




@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Require authentication
def recherche_nss_api(request ,nss):
    # Get the NSS from query parameters
    
    if not nss:
        return Response(
            {"error": "Le NSS est requis."},
            status=400
        )
    
    try:
        # Retrieve the user based on NSS
        user = CustomUser.objects.get(NSS=nss)
        
        # Retrieve the patient associated with the user
        patient = Patient.objects.get(user=user)
        
        # Retrieve the DPI associated with the patient
        dpi = Dpi.objects.get(patient=patient)
        
        return Response(
            {"status": "success", "dpi_id": dpi.id},
            status=200
        )

    except CustomUser.DoesNotExist:
        return Response(
            {"error": "Aucun utilisateur trouvé avec ce NSS."},
            status=404
        )
    except Patient.DoesNotExist:
        return Response(
            {"error": "Aucun patient trouvé pour cet utilisateur."},
            status=404
        )
    except Dpi.DoesNotExist:
        return Response(
            {"error": "Aucun DPI trouvé pour ce patient."},
            status=404
        )
    except Exception as e:
        logging.error(f"Erreur lors du traitement : {e}")
        return Response(
            {"error": "Une erreur s'est produite lors du traitement."},
            status=500
        )