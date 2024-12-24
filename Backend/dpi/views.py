
from .forms import OrdonnanceForm
import logging, qrcode
from django.shortcuts import render, redirect, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model
from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from users.models import CustomUser, Patient
from .models import  Dpi, Antecedent, Consultation,Ordonnance, Diagnostic,Medicament
from users.models import Patient
from users.forms import AntecedentFormSet, DpiForm  # Import the formset
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.template.loader import get_template  # Import get_template here
from xhtml2pdf import pisa
from datetime import datetime
from reportlab.lib.pagesizes import A5





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

            # Créer le diagnostic et l'associer à l'ordonnance
            diagnostic = Diagnostic.objects.create(ordonnance=ordonnance)

            # Associer ce diagnostic à la consultation
            consultation.diagnostic = diagnostic
            consultation.save()  # Sauvegarder les changements dans la base de données

            messages.success(request, "Diagnostic ajouté avec succès à la consultation.")
             # Redirection après l'ajout du diagnostic
            return redirect('ord-view', consultation_id=consultation.id, diagnostic_id=diagnostic.id)


    else:
        form = OrdonnanceForm()

    return render(request, 'creer_ord.html', {
        'form': form,
        'consultation': consultation.id # Passer l'objet consultation au template
    })

@login_required

def ajouter_consultation(request, dpi_id):

    dpi = get_object_or_404(Dpi, id=dpi_id)
     
    if request.method == 'POST':
        date = request.POST['date']
        type = request.POST['type']

        # Check for duplicate consultation
        if Consultation.objects.filter(date=date, dpi=dpi).exists():
            messages.error(request, "Une consultation à la même date pour ce patient existe déjà.")
            return redirect('ajouter_consultation', dpi_id=dpi.id)  # Redirect back with the DPI ID

        # Create the consultation
        consultation = Consultation.objects.create(
            date=date,
            dpi=dpi,
        )

        # Redirect based on the type of consultation
        if type == 'Diagnostic':
            return redirect('ajouter_diagnostic', consultation_id=consultation.id)
        elif type == 'Bilan':
            return redirect('ajouter_bilan', consultation_id=consultation.id)

        # Fallback: Redirect to showdpi
        return redirect('showdpi', dpi_id=dpi.id)

    # Render the consultation form
    return render(request, 'ajouter_consultation.html', {'dpi': dpi})

@login_required
def ajouter_bilan(request, consultation_id):
    # Retrieve consultation by ID or handle missing consultation
    consultation = get_object_or_404(Consultation, id=consultation_id)


    return render(request, 'ajouter_bilan.html', {
        'consultation_id': consultation.id,  # Pass the consultation ID to the template
    })

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