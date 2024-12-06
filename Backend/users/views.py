from django.shortcuts import render
from .decorators import role_required

# @role_required('adminCentral')
#def adminCentral_dashboard(request):
 #   return render(request, 'adminCentral_dashboard.html')

#@role_required('adminCentral')
def adminCentral_dashboard(request):
    return render(request, 'authentif.html')

#@role_required('adminSys')
#def adminSys_dashboard(request):
 #   return render(request, 'adminSys_dashboard.html')