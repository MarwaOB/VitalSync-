import logging
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.http import HttpResponse

<<<<<<< Updated upstream
@role_required('adminCentral')
def adminCentral_dashboard(request):
    return render(request, 'adminCentral_dashboard.html')

@role_required('adminSys')
def adminSys_dashboard(request):
    return render(request, 'adminSys_dashboard.html')
=======
# Set up logging
logger = logging.getLogger(__name__)

def sign_in(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        
        # Log the username
        logger.debug(f"Username: {username}")
        
        # Print the username to the console (for debugging only)
        print(f"Username: {username}")
        
        # Optionally print the password (for debugging only, don't do this in production!)
        # It's highly insecure to print the password
        print(f"Password: {password}")  # This is just for local testing, do not use in production
        
        # Authenticate user
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # User is authenticated, get role
            role = user.customuser.role  # Assuming you have the custom user model
            
            # Log the user in
            login(request, user)

            # Redirect based on role
            if role == 'adminCentral':
               return redirect('admincentral')
            else:
                return HttpResponse("Role non défini")
        else:
            return HttpResponse("Nom d'utilisateur ou mot de passe incorrect.")
    
    return render(request, 'signin.html')

def admincentral(request):
    return render(request, 'adminCentral.html')
>>>>>>> Stashed changes
