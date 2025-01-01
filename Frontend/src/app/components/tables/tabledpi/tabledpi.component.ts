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

   errorMessage: string | null = null; // Error message holder
   medecins: User[] = [];
   hospitals: Hospital[] = [];
   editMode: boolean = false;
   tempUserData:  { patient_id : number; medecin_id : number; }=
   {  
    patient_id: 0,
    medecin_id: 0,
   };
 
   constructor(
     private medecinService: MedecinService,
     private dpiService: DossierPatientService,

     private patientService: PatientService,
     private shareddpiService: ShareddpiService ,// inject the shared service

     private router: Router
   ) {}
 
   ngOnInit(): void {
     this.fetchMedecins_by_role();
     this.loadPatients_by_role();
     this.fetchdpi();
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
  
 
   openAddOverlay(): void 
   {
     this.tempUserData = 
     {  
      medecin_id: 0,
      patient_id: 0, };
 
     this.editMode = true;
   }
 
   saveChanges1(): void {
    // Call the service to add a new dpi
    this.dpiService.addDpi(this.tempUserData).subscribe({
     next: (response: any) => {
       console.log('laborantin added successfully', response);
       // You can reload or update the list of hospitals here
       this.fetchMedecins_by_role(); // Assuming this fetches updated data
       this.router.navigate(['/listdpi']);
 
     },
     error: (error: any) => {
       console.error('Error adding radiologue', error);
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
    this.dpiService.getAntecedentsByPatientId(patientId).subscribe({
      
      next: (response: any) => {
        console.log('Antecedents view successfully', response);
        // You can reload or update the list of hospitals here
        this.shareddpiService.setDpiData(response.data.dpi_id,patientId,response.data.antecedents,response.data.consultations);

        this.router.navigate(['/patient-dpi', patientId]);
  
      },
      error: (error: any) => {
        console.error('Antecedents view no ', error);
      }
    });
       }

}
