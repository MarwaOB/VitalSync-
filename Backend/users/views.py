import logging
from django.shortcuts import render, redirect, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser, Hospital, Patient
from dpi.models import  Dpi, Antecedent
from .forms import AntecedentFormSet, DpiForm  # Import the formset
from django.contrib import messages



@csrf_exempt


@csrf_exempt
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
        mutuelle = request.POST.get('mutuelle', '')

        if CustomUser.objects.filter(username=username).exists():
            messages.error(request, "Le nom d'utilisateur existe déjà.")
            return redirect('add_user')  

        if CustomUser.objects.filter(telephone=telephone).exists():
            messages.error(request, "Le numéro de téléphone est déjà utilisé.")
            return redirect('add_user') 


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
                elif role == 'biologiste':
                    return HttpResponse("biologiste")
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

def admincentral(request):
    return render(request, 'adminCentral.html')

def adminsys(request):
    return render(request, 'adminSys.html')
def creerDPI(request):
    if request.method == 'POST':
        dpi_form = DpiForm(request.POST)
        formset = AntecedentFormSet(request.POST)

        if dpi_form.is_valid() and formset.is_valid():
            dpi = dpi_form.save()
            patient = dpi.patient.user
            patient.dpi_null = False
            patient.save()
            for form in formset:
                antecedent = form.save(commit=False)
                antecedent.dpi = dpi
                antecedent.save()

            return redirect('adminSys')  # Redirect to a success page
        else:
            print("DPI form errors:", dpi_form.errors)
            print("Formset errors:", formset.errors)
    else:
        dpi_form = DpiForm()
        formset = AntecedentFormSet(queryset=Antecedent.objects.none())
    
    return render(request, 'creerDPI.html', {
        'dpi_form': dpi_form,
        'formset': formset
    })


@csrf_exempt
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

        elif action == "recherche_dpi":
            # Redirect to a search page
            return redirect('rechercheDpi')  

        elif action == "creer-dpi":
            # Redirect to a search page
            return redirect('creerDPI')  
            
        else:
            # Handle invalid action
            return HttpResponse("Invalid action", status=400)

    # If not a POST request, render the home page
    return render(request, 'medecinHome.html')


@csrf_exempt
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
def show_users_by_hospital(request):
    user_hospital_id = request.user.hospital.id

    users_in_hospital = CustomUser.objects.filter(hospital__id=user_hospital_id)

    return render(request, 'adminSysShow.html', {'users': users_in_hospital})

def show_hospital(request):
    hospitals = Hospital.objects.all()
    return render(request, 'adminCentralShow.html', {
        'hospitals': hospitals,
    })

def admincentralShow(request):
    return render(request, 'adminCentralShow.html')


def adminSysHome(request):
    return render(request, 'adminSysHome.html')


def adminSysShow(request):
    return render(request, 'adminSysShow.html')  