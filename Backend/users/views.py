import logging
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser, Hospital
from dpi.models import  Dpi, Antecedent
from .forms import AntecedentFormSet  # Import the formset
import random
import string
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.utils.timezone import now
from datetime import date
from django.contrib.auth.decorators import login_required  # Import the login_required decorator






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
        mutuelle = request.POST.get('mutuelle', '')

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

@login_required
def add_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        role = request.POST['role']
        date_de_naissance = request.POST['date_de_naissance']
        adresse = request.POST['adresse']
        telephone = request.POST['telephone']
        mutuelle = request.POST.get('mutuelle', '')

        user = CustomUser.objects.create_user(
            username=username,
            password=password,
            role=role,
            date_de_naissance=date_de_naissance,
            adresse=adresse,
            telephone=telephone,
            mutuelle=mutuelle,
            hospital= request.user.hospital,
        )
        if (user.role == 'patient'):
            return redirect('creerDPI')
        else:
            return redirect('adminSys') 

    return render(request, 'adminSys.html')

@login_required
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
                    return HttpResponse("medecin")
                elif role == 'patient':
                    return HttpResponse("patient")
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
        # Create Dpi object (you can add fields here as needed)
        dpi = Dpi.objects.create()

        # Create formset for antecedents
        formset = AntecedentFormSet(request.POST)
        
        if formset.is_valid():
            # Assign the current dpi to each antecedent in the formset
            for form in formset:
                antecedent = form.save(commit=False)  # Do not save yet
                antecedent.dpi = dpi  # Assign the current dpi to this antecedent
                antecedent.save()  # Save the antecedent to the database
            
            return redirect('adminSys')  # Redirect to a success page or whatever is needed
        else:
            # If formset is invalid, show the form with errors
            return render(request, 'creerDPI.html', {'formset': formset, 'dpi': dpi})

    # Initialize a new empty formset for GET requests
    formset = AntecedentFormSet(queryset=Antecedent.objects.none())
    return render(request, 'creerDPI.html', {'formset': formset})

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

def add_admin(request):
    # Define the admin details
    username = "Merieem"
    password = "meriem"  # Ideally hashed, but for simplicity, leaving plain
    email = "admin@example.com"

    # Check if the user already exists
    if CustomUser.objects.filter(username=username).exists():
        return JsonResponse({"message": "Admin user already exists!"}, status=400)

    # Create the admin user
    admin_user = CustomUser.objects.create_superuser(
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