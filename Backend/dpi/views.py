from django.shortcuts import render, redirect
from .forms import OrdonnanceForm
from .models import Ordonnance, Diagnostic
from django.contrib.auth.decorators import login_required

@login_required

def creer_ordonnance(request):
    # Check if the user is authenticated
    if not request.user.is_authenticated:
        messages.error(request, "You must be logged in to create an ordonnance.")
        return redirect('login')  # Redirect to login page if not authenticated
    
    if request.method == 'POST':
        form = OrdonnanceForm(request.POST)
        
        # Ensure the user is a doctor (medecin)
        if request.user.role != 'medecin':  # If the user is not a doctor
            messages.error(request, "You must be a doctor to create an ordonnance.")
            return redirect('home')  # Redirect to the homepage or another page if not a doctor
        
        if form.is_valid():
            ordonnance = form.save()  # Save the Ordonnance first
            
            # Create a Diagnostic for this Ordonnance
            diagnostic = Diagnostic.objects.create(ordonnance=ordonnance)
            
            # Optionally, handle Medicaments creation here if needed
            return redirect('medecin_Home')  # Redirect after saving the Ordonnance
    
    else:
        form = OrdonnanceForm()
    
    return render(request, 'creer_ord.html', {'form': form})
