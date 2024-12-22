import logging, qrcode
from django.shortcuts import render, redirect, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from users.models import CustomUser, Patient
from .models import  Dpi, Antecedent, Consultation, Biologique, Radiologique
from users.forms import AntecedentFormSet, DpiForm  # Import the formset
from django.contrib import messages
from django.utils.datastructures import MultiValueDictKeyError
from django.contrib.auth.decorators import login_required

@login_required
def ajouter_consultation(request, dpi_id):
    dpi = get_object_or_404(Dpi, id=dpi_id)

    if request.method == "POST":
        try:
            date = request.POST["date"]  # Access `date` directly
            typee = request.POST["type"]  # Access `type` directly

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
            if typee == 'Diagnostic':
                return redirect('ajouter_diagnostic', consultation_id=consultation.id)
            elif typee == 'Bilan':
                return redirect('ajouter_bilan', consultation_id=consultation.id)
        except MultiValueDictKeyError as e:
            missing_field = str(e)  # Determine which field is missing
            messages.error(request, f"Le champ '{missing_field}' est obligatoire.")


    # Render the consultation form
    return render(request, 'ajouter_consultation.html', {'dpi': dpi})

# Configure logging
logger = logging.getLogger(__name__)

@login_required
def ajouter_bilan(request, consultation_id):
    logger.debug(f"Entering ajouter_bilan with consultation_id={consultation_id}")
    
    consultation = get_object_or_404(Consultation, id=consultation_id)
    logger.debug(f"Fetched consultation: {consultation}")

    # Determine available options
    can_create_biologique = consultation.bilanBiologique is None
    can_create_radiologique = consultation.bilanRadiologique is None
    logger.debug(f"can_create_biologique={can_create_biologique}, can_create_radiologique={can_create_radiologique}")

    if request.method == "POST":
        bilan_type = request.POST.get("bilan_type")
        logger.debug(f"POST request received with bilan_type={bilan_type}")

        if bilan_type == "biologique" and can_create_biologique:
            logger.info(f"Redirecting to ajouter_biologique_bilan for consultation_id={consultation_id}")
            return redirect("ajouter_biologique_bilan", consultation_id=consultation_id)
        elif bilan_type == "radiologique" and can_create_radiologique:
            logger.info(f"Redirecting to ajouter_radiologique_bilan for consultation_id={consultation_id}")
            return redirect("ajouter_radiologique_bilan", consultation_id=consultation_id)
        else:
            logger.warning("Attempted to create an already existing bilan type")
            messages.error(request, "This type of bilan has already been created.")

    logger.debug("Rendering ajouter_bilan template")
    return render(request, "ajouter_bilan.html", {
        "consultation": consultation,
        "can_create_biologique": can_create_biologique,
        "can_create_radiologique": can_create_radiologique,
    })


@login_required
def ajouter_biologique_bilan(request, consultation_id):
    logger.debug(f"Entering ajouter_biologique_bilan with consultation_id={consultation_id}")
    
    consultation = get_object_or_404(Consultation, id=consultation_id)
    logger.debug(f"Fetched consultation: {consultation}")

    if consultation.bilanBiologique is not None:
        logger.warning("Biologique Bilan already exists for this consultation.")
        messages.error(request, "A Biologique Bilan already exists for this consultation.")
        return redirect("ajouter_bilan", consultation_id=consultation.id)

    if request.method == "POST":
        logger.info("Creating a new Biologique Bilan")
        # Create the Biologique bilan
        Biologique.objects.create(consultation=consultation)
        messages.success(request, "Biologique Bilan created successfully.")
        logger.info(f"Biologique Bilan created successfully for consultation_id={consultation.id}")
        return redirect("consultation_detail", consultation_id=consultation.id)

    logger.debug("Rendering ajouter_biologique_bilan template")
    return render(request, "ajouter_biologique_bilan.html", {"consultation": consultation})
@login_required
def ajouter_radiologique_bilan(request, consultation_id):
    consultation = get_object_or_404(Consultation, id=consultation_id)

    if consultation.bilanRadiologique is not None:
        messages.error(request, "A Radiologique Bilan already exists for this consultation.")
        return redirect("ajouter_bilan", consultation_id=consultation.id)

    if request.method == "POST":
        # Create the Radiologique bilan
        Radiologique.objects.create(consultation=consultation)
        messages.success(request, "Radiologique Bilan created successfully.")
        return redirect("consultation_detail", consultation_id=consultation.id)

    return render(request, "ajouter_radiologique_bilan.html", {"consultation": consultation}) 

def consultation_detail(request, consultation_id):
    # Fetch the consultation or return a 404 error if it doesn't exist
    consultation = get_object_or_404(Consultation, id=consultation_id)

    context = {
        "consultation": consultation,
        "bilan_biologique": consultation.bilanBiologique,
        "bilan_radiologique": consultation.bilanRadiologique,
    }

    return render(request, "consultation_detail.html", context)

@login_required
def ajouter_diagnostic(request, consultation_id):
    # Retrieve consultation by ID or handle missing consultation
    consultation = get_object_or_404(Consultation, id=consultation_id)

    return render(request, 'ajouter_diagnostic.html', {
        'consultation_id': consultation.id,  # Pass the consultation ID to the template
    })