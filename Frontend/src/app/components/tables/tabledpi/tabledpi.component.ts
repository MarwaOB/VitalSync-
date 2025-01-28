import { Antecedent } from './../../../shared/models/Dpi/Antecedent';
import { Patient } from './../../../shared/models/Users/Patientt';
import { Component, NgModule } from '@angular/core';
import { MedecinService } from '../../../services/medecin/medecin.service';
import { DossierPatientService } from '../../../services/DossierPatient/Dp/dossier-patient.service';
import { PatientService } from '../../../services/patient/patient.service';
import { Router } from '@angular/router';
import { Hospital } from '../../../shared/models/hospital';
import { User } from '../../../shared/models/Users/User';
import { Dpi } from '../../../shared/models/Dpi/Dpi';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ShareddpiService } from '../../../services/shareddpi/shareddpi.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-tabledpi',
  imports: [FormsModule,NgFor, NgIf],
  templateUrl: './tabledpi.component.html',
  styleUrl: './tabledpi.component.css'
})
export class TabledpiComponent {
   patients: any[] = []; // Array to hold medecins data
   dpis: any[] = []; // Array to hold medecins data
   loading: boolean = false; // Loading indicator
   dpi:any ;
   antecedents:any ;
   dpiId:number = 0 ;
   searcheddpi:any ; 
   errorMessage: string | null = null; // Error message holder
   medecins: User[] = [];
   hospitals: Hospital[] = [];
   editMode: boolean = false;
   qr_path : any ;
   searchNss : any ;
   imagePath: string | null = null; // Holds the base64 string or file path
   user:any;
   tempUserData:  { patient_id : number; medecin_id : number; }=
   {  
    patient_id: 0,
    medecin_id: 0,
   };
 
   constructor(
     private medecinService: MedecinService,
     private dpiService: DossierPatientService,
     private userService: UserService  ,
     private patientService: PatientService,
     private shareddpiService: ShareddpiService ,// inject the shared service
     private router: Router
   ) {}
 
   ngOnInit(): void {
     this.fetchMedecins_by_role();
     this.loadPatients_by_role();
     this.fetchdpi();
     this.user = this.userService.user;

   }
 

   isDpiNull(dpi: any) {
    return dpi.dpi_null;
  }
   fetchMedecins_by_role(): void {
    this.loading = true;
    this.errorMessage = null;

    this.medecinService.getAll().subscribe({
      next: (response) => {
        this.medecins = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch medecins. Please try again later.';
        this.loading = false;
        console.error('Error fetching medecins:', error);
      }
    });
  }
  fetchdpi(): void {
    this.loading = true;
    this.errorMessage = null;

    this.dpiService.getAll().subscribe({
      next: (response) => {
        this.dpis = response.dpis || [];
        console.log(this.dpis)
        this.loading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to fetch dpis. Please try again later.';
        this.loading = false;
        console.error('Error fetching dpis:', error);
      }
    });
  }

  loadPatients_by_role(): void {
    this.patientService.getPatients_by_role().subscribe(
      
      (response) => {
        this.patients = response.patients;  // Store the patients data from the API

      },
      error => {
        this.errorMessage = 'Failed to load patients. Please try again later.';
        console.error('Error loading patients:', error);
      }
    );
  }
  
  
  openAddOverlay(): void {
    this.tempUserData = {  
      medecin_id: this.user?.role === 'medecin' ? this.user.id : 0,  // Pre-fill for medecin
      patient_id: 0
    };
    
    this.editMode = true;
  }
 
  saveChanges1(): void {
    console.log('Sending data:', this.user); // Log the data being sent

    if (this.user?.role === 'medecin') {
      this.tempUserData.medecin_id = this.user.id; // Ensure the correct ID is assigned
    }
  
    console.log('Sending data:', this.tempUserData); // Log the data being sent
  
    this.dpiService.addDpi(this.tempUserData).subscribe({
      next: (response: any) => {
        console.log('DPI added successfully', response);
        this.fetchdpi(); // Refresh list
        this.router.navigate(['/listdpi']);
      },
      error: (error: any) => {
        console.error('Error adding DPI:', error);
        if (error.error) {
          console.error('Server Response:', error.error);
        }
      }
    });
  
    this.editMode = false;
  }
  
  
 
   cancelEdit(): void {
     this.editMode = false;
   }
 
   editdpi(id:number): void {
    // this.tempUserData = { ...medecin };
    // this.editMode = true;
   }
 
   deletedpi(id: number): void {
     // Add delete functionality if needed
   }
   
   voirDpi(patientId: number): void {
    console.log('dddddddd',patientId)
    this.dpiService.getAntecedentsByPatientId(patientId).subscribe({
      
      next: (response: any) => {
        console.log('Antecedents view successfully', response);
        // You can reload or update the list of hospitals here
        console.log('dpi id', response.dpi_id);
        console.log('dpi id', response.antecedents);

        this.shareddpiService.setDpiPatientAntecedents(response.dpi_id,patientId,response.antecedents);
              //  this.router.navigate(['/patient-dpi', patientId]);

      },
      error: (error: any) => {
        console.error('Antecedents view no ', error);
      }
    });
    this.dpiService.getConsultationsByPatientId(patientId).subscribe({
      
      next: (response: any) => {
        console.log('Consultaions view successfully', response);
        // You can reload or update the list of hospitals here
        this.shareddpiService.setConsultations(response.consultations);

        this.router.navigate(['/patient-dpi', patientId]);
  
      },
      error: (error: any) => {
        console.error('Consultaiona view no ', error);
      }
    });

       }
       onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
      
        if (input.files && input.files[0]) {
          const file = input.files[0];
      
          if (file.type === 'image/png') {
            // Assume the path follows a known directory structure, e.g., `/media/qr_codes/`
            this.qr_path = `qr_codes/${file.name}`; // Example: `qr_codes/qr_code_88888888.png`
            console.log('QR Path:', this.qr_path);
          } else {
            this.qr_path = null;
            alert('Only PNG files are allowed.');
          }
        }
      }
      filtrerParNss(): void {
        if (!this.searchNss) {
            alert('Please enter a valid NSS.');
            return;
        }
    
        console.log('Filtering by NSS:', this.searchNss);
        this.dpiService.filterBynss(this.searchNss).subscribe({
          next: (response: any) => {
            console.log('Filtered  nss ID:', response);
      
            if (response && response.dpi_id) {
              this.dpis = this.dpis.filter(dpi => dpi.id === response.dpi_id);
            } else {
              alert('No matching DPI found.');
              this.dpis = []; // Clear the list if no match is found
            }
          },
          error: (error: any) => {
            console.error('Error filtering by image:', error);
            alert('Failed to filter DPI data. Please try again.');
          }
        });
    }
    
      filtrerParQrCode(): void {
        if (!this.qr_path) {
          alert('No valid QR code path provided.');
          return;
        }
        console.log('Filtered DPI ID   3333:', this.qr_path);

        this.dpiService.filterByImage(this.qr_path).subscribe({
          next: (response: any) => {
            console.log('Filtered DPI ID:', response);
      
            if (response && response.dpi_id) {
              this.dpis = this.dpis.filter(dpi => dpi.id === response.dpi_id);
            } else {
              alert('No matching DPI found.');
              this.dpis = []; // Clear the list if no match is found
            }
          },
          error: (error: any) => {
            console.error('Error filtering by image:', error);
            alert('Failed to filter DPI data. Please try again.');
          }
        });
      }
    
    

  private formatDate(dateString: string): string {
    const [day, month, year] = dateString.split('/'); // Séparer la date en jour, mois, et année
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Reconstruire la date au format YYYY-MM-DD
  }
}
 