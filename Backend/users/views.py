import logging, qrcode
from django.shortcuts import render, redirect, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser, Hospital, Patient
from dpi.models import  Dpi, Antecedent
from .forms import AntecedentFormSet  # Import the formset
import random
import string
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.utils.timezone import now
from datetime import date
from django.contrib.auth.decorators import login_required  # Import the login_required decorator
from .forms import AntecedentFormSet, DpiForm  # Import the formset
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from pyzbar.pyzbar import decode
from django.core.files.storage import FileSystemStorage
from PIL import Image
import io


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
        username = request.POST['username']
        password = request.POST['password']
        
        try:
            # Get the user using the custom user model
            user = authenticate(request, username=username, password=password)
            
            # Check the password
            if user is not None:   
                role = user.role  
                login(request, user)
                
                # Redirect based on role
                if role == 'adminCentral':
                    return redirect('admin_Central_Home')
                elif role == 'adminSys':
                    return redirect("admin_Sys_Home")
                elif role == 'medecin':
                    return redirect("medecin_Home")
                elif role == 'patient':
                    return redirect("show_dpi_by_patient")
                elif role == 'infermier':
                    return HttpResponse("infermier")
                elif role == 'radioloque':
                    return HttpResponse("radioloque")
                elif role == 'laborantin':
                    return HttpResponse("laborantin")
                elif role == 'pharmacien':
                    return HttpResponse("pharmacien")
                else:
                    return HttpResponse("Role non défini")
            else:
                return HttpResponse("Nom d'utilisateur ou mot de passe incorrect.")
        
        except get_user_model().DoesNotExist:
            return HttpResponse("Nom d'utilisateur ou mot de passe incorrect.")
    
    return render(request, 'signin.html')

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

            # Update the patient's DPI status
            patient = dpi.patient
            patient.dpi_null = False
            patient.save()

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
def Consultation(request):
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

def add_admin(request):
    # Define the admin details
    username = "Meriem"
    password = "meriem"  # Ideally hashed, but for simplicity, leaving plain
    email = "admin@example.com"

    # Check if the user already exists
    if CustomUser.objects.filter(username=username).exists():
        return JsonResponse({"message": "Admin user already exists!"}, status=400)

    # Create the admin user
    admin_user = CustomUser.objects.create_superuser(
        NSS=1234,
        username=username,
        password=password,
        email=email,
        first_name="meriem",
        last_name="Admin",
        is_staff=True,
        is_active=True,
        date_de_naissance=date(1990, 1, 1),
        date_joined=now()
    )

    # Optionally add extra fields if your model has them
    admin_user.role = "adminCentral"
    admin_user.save()

    return JsonResponse({
        "message": "Admin user created successfully!",
        "username": admin_user.username,
        "email": admin_user.email,
        "role": admin_user.role,
    })
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
            dpis = Dpi.objects.filter(patient=patient, hospital=current_user_hospital)

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

