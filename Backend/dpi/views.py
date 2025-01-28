import logging
from datetime import timedelta
from datetime import datetime
import os
import qrcode
from xhtml2pdf import pisa
from reportlab.lib.pagesizes import A5
from django.shortcuts import render, redirect, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model
from django.http import HttpResponse, Http404, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.utils.datastructures import MultiValueDictKeyError
from django.utils import timezone
from django.template.loader import get_template
from users.models import CustomUser, Patient
from .models import Dpi, Antecedent, Consultation, Ordonnance, Diagnostic, Medicament, Biologique, Radiologique, Examen , Soin , SoinInfermierObservation , AdministrationMeds 
from .forms import OrdonnanceForm
from users.forms import AntecedentFormSet, DpiForm
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, serializers
from rest_framework.decorators import api_view
from .serializers import OrdonnanceSerializer
from decimal import Decimal

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from .models import Ordonnance
import responses
import random
from rest_framework.renderers import JSONRenderer
import random
import responses
import requests
from django.http import HttpResponse
from rest_framework.views import APIView
from django.utils import timezone

@responses.activate
def validate_ordonnance_mock():
    # Randomly decide the validation result for demonstration purposes
    validation_result = random.choice(["validated", "refused"])
    
    # Add the mock response for validation
    responses.add(
        responses.POST,
        "https://sgph.example.com/api/validate",  # Exact URL to mock
        json={"status": validation_result},  # Response body
        status=200,  # HTTP status
    )
    response = requests.post("https://sgph.example.com/api/validate")
    print(f"Status: {response.status_code}, Body: {response.json()}")  # Should print mocked response
class ValidateOrdonnanceAPIView(APIView):
    def post(self, request, ordonnance_id):
        try:
            ordonnance = Ordonnance.objects.get(id=ordonnance_id)
            if ordonnance.status != "en_attente":
                return HttpResponse("Ordonnance déjà traitée.", status=400)

            # Activate mocking programmatically
            with responses.RequestsMock() as rsps:
                # Set up the mock response
                validation_result = random.choice(["validated", "refused"])
                rsps.add(
                    responses.POST,
                    "https://sgph.example.com/api/validate",  # Exact URL
                    json={"status": validation_result},      # Mocked response
                    status=200,
                )

                # Make the request (mocked)
                sgph_response = requests.post("https://sgph.example.com/api/validate")

                # Process the mocked response
                if sgph_response.status_code == 200:
                    sgph_data = sgph_response.json()
                    if sgph_data["status"] == "validated":
                        ordonnance.status = "valide"
                        ordonnance.validation_date = timezone.now()
                        ordonnance.is_valid = True
                    elif sgph_data["status"] == "refused":
                        ordonnance.status = "rejete"
                    ordonnance.save()
                    return HttpResponse("Ordonnance validée.", status=200)
                else:
                    return HttpResponse("Erreur du service SGPH.", status=503)

        except Ordonnance.DoesNotExist:
            return HttpResponse("Ordonnance introuvable.", status=404)
        except Exception as e:
            return HttpResponse(f"Erreur: {str(e)}", status=500)
@csrf_exempt
@login_required
def ajouter_diagnostic(request, consultation_id):
    # Récupérer la consultation associée ou retourner une 404 si elle n'existe pas
    consultation = get_object_or_404(Consultation, id=consultation_id)

    # Vérifier si l'utilisateur est connecté
    if not request.user.is_authenticated:
        messages.error(request, "Vous devez être connecté pour ajouter un diagnostic.")
        return redirect('sign_in')  # Redirection vers la page de connexion

    # Vérifier si l'utilisateur est médecin
    if request.user.role != 'medecin':
        messages.error(request, "Vous devez être médecin pour ajouter un diagnostic.")
        return redirect('home')  # Redirection si l'utilisateur n'est pas médecin

    if request.method == 'POST':
        form = OrdonnanceForm(request.POST)

        if form.is_valid():
            # Créer une nouvelle ordonnance à partir du formulaire
            ordonnance = form.save()
            if not ordonnance.meds.exists():  # Si l'ordonnance n'a pas de médicaments associés
                messages.error(request, "Veuillez ajouter au moins un médicament à l'ordonnance.")
                return redirect('ajouter_diagnostic', consultation_id=consultation.id)

            # Créer le diagnostic et l'associer à l'ordonnance
            diagnostic = Diagnostic.objects.create(ordonnance=ordonnance)

            # Associer ce diagnostic et soin à la consultation
            consultation.diagnostic = diagnostic
            consultation.save()  # Sauvegarder les changements dans la base de données

            messages.success(request, "Diagnostic et soin ajoutés avec succès à la consultation.")

            # Redirection après l'ajout du diagnostic et du soin
            return redirect('ord-view', consultation_id=consultation.id, diagnostic_id=diagnostic.id)

    else:
        form = OrdonnanceForm()

    return render(request, 'creer_ord.html', {
        'form': form,
        'consultation': consultation.id  # Passer l'objet consultation au template
    })


@csrf_exempt
@login_required
def creer_ord(request,consultation_id):
    consultation = get_object_or_404(Consultation, id=consultation_id)
    form = OrdonnanceForm()

    return render(request, 'creer_ord.html', {
            'consultation': consultation.id, 
            'form': form,
            # Passer l'objet consultation au template
        })
    


@csrf_exempt
@login_required
def render_pdf_view(request, consultation_id,diagnostic_id):

    consultation = get_object_or_404(Consultation, id=consultation_id)

    # Get the Diagnostic object or return 404 if not found
    diagnostic = get_object_or_404(Diagnostic, id=diagnostic_id)

    # Get the Dpi object related to this consultation
    dpi = get_object_or_404(Dpi, id=consultation.dpi.id)  # Get the actual Dpi object

    # Get the Patient object related to this Dpi
    patient = get_object_or_404(Patient, id=dpi.patient.id)  # Ensure you're getting the right Patient

    # Get all Ordonnances related to the diagnostic
    ordonnance = diagnostic.ordonnance  # Directly access the ordonnance from the diagnostic

    # If no ordonnance is found, return an error response
    if not ordonnance:
        return HttpResponse("No ordonnance found for this diagnostic.", status=404)

    aujourdhui = datetime.now()
    
    # Calculer l'âge en fonction de la date de naissance
    age = aujourdhui.year - patient.user.date_de_naissance.year
    medicaments = Medicament.objects.filter(ordonnance = ordonnance.id)
    context = {

        'consultation': consultation,
        'diagnostic': diagnostic,
        'dpi': dpi,
        'patient': patient,
        'ordonnance': ordonnance,
        'medicaments': medicaments,
        'age': age,
    }
    template_path = 'ordonnence-view.html'
    # Create a Django response object, and specify content_type as pdf
    response = HttpResponse(content_type='application/pdf')  # Corrected content type to 'application/pdf'
    response['Content-Disposition'] = filename="ordonnence_{patient.user.NSS}_{consultation_id}.pdf"

    template = get_template(template_path)
    html = template.render(context)
    # Create a PDF
    pisa_status = pisa.CreatePDF(html, dest=response, default_page_size=A5)
    # If error, then show a fallback view
    if pisa_status.err:
        return HttpResponse('We had some errors <pre>' + html + '</pre>')
    return response
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




@login_required
@csrf_exempt
def ajouter_consultation(request, dpi_id):
    dpi = get_object_or_404(Dpi, id=dpi_id)
    patient = dpi.patient  # Get the patient associated with the DPI
    message = None  # Default message is None

    try: 
            
        current_date = timezone.now().date()
        # Check for duplicate consultation
        if Consultation.objects.filter(date=current_date, dpi=dpi).exists():
            cons = Consultation.objects.get(date=current_date, dpi=dpi)
            message = "Une consultation à la même date pour ce patient existe déjà."
            return render(request, 'dpiShow.html', {
                'patient': patient,
                'dpi': dpi,
                'antecedents': dpi.antecedents.all(),
                'message': message,
                'latest_consultation': cons
            })

        # Create the consultation
        consultation = Consultation.objects.create(date=current_date, dpi=dpi)


    except MultiValueDictKeyError as e:
        missing_field = str(e)
        message = f"Le champ '{missing_field}' est obligatoire."
        return render(request, 'dpiShow.html', {
                'patient': patient,
                'dpi': dpi,
                'antecedents': dpi.antecedents.all(),
                'message': message,
                'latest_consultation': consultation


            })
    return render(request, 'dpiShow.html', {
                'patient': patient,
                'dpi': dpi,
                'antecedents': dpi.antecedents.all(),
                'message': message,

            })# Configure logging
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




def consultation_detail(request, consultation_id):
    consultation = get_object_or_404(Consultation, id=consultation_id)
    dpi = consultation.dpi
    diagnostic = consultation.diagnostic
    soins = None
    soins_infermier_observations = None
    if diagnostic:  
        soins = diagnostic.soin
        if soins: 
            soins_infermier_observations = SoinInfermierObservation.objects.filter(soin=soins)
            



    # Get the ordonnance and update checklist

    context = {
        "consultation": consultation,
        "bilan_biologique": consultation.bilanBiologique,
        "bilan_radiologique": consultation.bilanRadiologique,
        "SoinInfermierObservation": soins_infermier_observations,
    }

    return render(request, 'consultation_detail.html', context)


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


def afficher_ordonnances_non_valide(request):
    if request.user.role == 'pharmacien':
      
        # Filtrer les diagnostics dont l'ordonnance est non validée
        diagnostics_non_valides = Diagnostic.objects.filter(ordonnance__is_valid=False)

        # Contexte passé au template
        context = {

            'ordonnances': diagnostics_non_valides,
        }

        return render(request, 'ordonnances_non_valide.html', context)
    else:
        # Si l'utilisateur n'a pas le rôle requis, lever une erreur 404
        raise Http404("Vous n'êtes pas autorisé à valider cette ordonnance.")

def supprimer_toutes_ordonnances_non_valide(request):

    Medicament.objects.all().delete()

    # Supprimer toutes les ordonnances
    Ordonnance.objects.all().delete()
    Consultation.objects.all().delete()


    messages.success(request, "Toutes les ordonnances non validées ont été supprimées avec succès.")
    return redirect('afficher_ordonnances_non_valide')
    

def valider_ordonnance(request, ordonnance_id):
    if request.user.role == 'pharmacien':
    
        # Récupérer l'ordonnance avec l'ID fourni
        ordonnance = get_object_or_404(Ordonnance, id=ordonnance_id)

        # Valider l'ordonnance en mettant is_valid à True
        ordonnance.is_valid = True
        ordonnance.save()  # Sauvegarder les modifications dans la base de données

        # Message de succès
        messages.success(request, "L'ordonnance a été validée avec succès.")

        # Rediriger vers la page des ordonnances ou une autre vue appropriée
        return redirect('afficher_ordonnances_non_valide')  
    else:
        # Si l'utilisateur n'a pas le rôle requis, lever une erreur 404
        raise Http404("Vous n'êtes pas autorisé à valider cette ordonnance.")

def afficher_ordonnances_valide(request):

    if request.user.role == 'pharmacien':
      
        # Filtrer les diagnostics dont l'ordonnance est non validée
        diagnostics_valides = Diagnostic.objects.filter(ordonnance__is_valid=True)

        # Contexte passé au template
        context = {

            'ordonnances': diagnostics_valides,
        }

        return render(request, 'ordonnance_valide.html', context)
    else:
        # Si l'utilisateur n'a pas le rôle requis, lever une erreur 404
        raise Http404("Vous n'êtes pas autorisé à valider cette ordonnance.")

@csrf_exempt
def checklist_view(request, consultation_id):
    # Fetch the consultation and associated ordonnance
    consultation = get_object_or_404(Consultation, id=consultation_id)
    ordonnance = consultation.diagnostic.ordonnance if consultation.diagnostic else None

    if not ordonnance:
        return HttpResponse("No ordonnance found for this consultation.", status=404)

    # Get or create AdministrationMeds instance
    administration_meds, created = AdministrationMeds.objects.get_or_create(ordonnance=ordonnance)

    # Update the checklist dynamically
    administration_meds.update_checklist()
    soins = consultation.diagnostic.soin
    
    if soins is None: 
        soins = Soin.objects.create(
            dpi=consultation.dpi,
            )
    soins.aministration =  administration_meds  
    soins.save()
    consultation.diagnostic.soin = soins
    consultation.diagnostic.save()

    context = {
        "consultation": consultation,
        "ordonnance": ordonnance,
        "checklist": administration_meds.checklist,
    }

    return render(request, 'checklist.html', context)


@csrf_exempt
@login_required
def ajouter_soin(request, consultation_id):
    if request.method == 'POST':
        # Récupérer les données envoyées via le formulaire
        observation = request.POST.get('observation')  # Texte pour l'observation
        soins_infermier = request.POST.get('soin')  # Texte pour les soins infirmiers

        # Récupérer l'objet Consultation correspondant
        consultation = get_object_or_404(Consultation, id=consultation_id)
        dpi = consultation.dpi
        diagnostic = consultation.diagnostic

        # Vérifier si soins existe, sinon créer un nouveau soin
        soins = diagnostic.soin
    
        if soins is None: 
            soins = Soin.objects.create(dpi=dpi)
            diagnostic.soin = soins
            diagnostic.save()
       
        # Créer une nouvelle observation de soin infirmier
        SoinInfermierObservation.objects.create(
            observation=observation,
            soins_infermier=soins_infermier,
            infermier=request.user,
            soin=soins  # Assignation correcte du soin
        )




        # Redirection vers la page des détails de la consultation
        return redirect('consultation_detail', consultation_id=consultation.id)

    # Rendre la page avec le formulaire et les soins existants
    return render(request, 'ajouter_soin.html')

@csrf_exempt
def mark_administered(request, consultation_id):
    if request.method == 'POST':
        med_name = request.POST.get('med_name')
       

        consultation = get_object_or_404(Consultation, id=consultation_id)
        ordonnance = consultation.diagnostic.ordonnance if consultation.diagnostic else None

        if not ordonnance:
            return HttpResponse("No ordonnance found for this consultation.", status=404)

        administration_meds = get_object_or_404(AdministrationMeds, ordonnance=ordonnance)

        try:
            administration_meds.mark_as_administered(med_name)
        except ValueError as e:
            return HttpResponse(str(e), status=400)

        return redirect('checklist', consultation_id=consultation.id)

    return HttpResponse("Invalid request method.", status=405)
