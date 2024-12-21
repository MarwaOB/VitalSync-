import logging, qrcode
from django.shortcuts import render, redirect, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from users.models import CustomUser, Patient
from .models import  Dpi, Antecedent, Consultation
from users.forms import AntecedentFormSet, DpiForm  # Import the formset
from django.contrib import messages
from django.contrib.auth.decorators import login_required


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

@login_required
def ajouter_diagnostic(request, consultation_id):
    # Retrieve consultation by ID or handle missing consultation
    consultation = get_object_or_404(Consultation, id=consultation_id)

    return render(request, 'ajouter_diagnostic.html', {
        'consultation_id': consultation.id,  # Pass the consultation ID to the template
    })