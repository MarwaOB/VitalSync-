import { Radiologique } from './../../../shared/models/Dpi/BilanRadiologique';
import { Radiologue } from './../../../shared/models/Users/Radiologue';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RadiologueService } from '../../../services/radiologue/radiologue.service';
import { User } from '../../../shared/models/Users/User';
import { Hospital } from '../../../shared/models/hospital';
import { HospitalService } from '../../../services/hospital/hospital.service';
import { MedecinService } from '../../../services/medecin/medecin.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-table-radiologues',
  imports: [CommonModule,FormsModule],
  templateUrl: './table-radiologues.component.html',
  styleUrl: './table-radiologues.component.css'
})
export class TableRadiologuesComponent {
  radiologues: any[] = []; // Array to hold medecins data
   loading: boolean = false; // Loading indicator
   errorMessage: string | null = null; // Error message holder
 
   laborantins: any[] = []; // Array to hold medecins data
   medecins: User[] = [];
   hospitals: Hospital[] = [];
   editMode: boolean = false;
   tempUserData:  { role: string ,username: string; password: string; first_name: string;last_name: string; adresse: string; date_de_naissance: Date; hospital: number ;mutuelle: string;NSS: number;email: string;telephone: string;  } = {
     role: 'radioloque',
     first_name: '',
     last_name: '',
     username: '',
     password:'',
     date_de_naissance: new Date(),
     NSS: 0,
     mutuelle: '',
     adresse: '',
     telephone: '',
     email: '',
     hospital: 0,
 
 };
 
   constructor(
     private medecinService: MedecinService,
     private radiologigueService: RadiologueService,

     private hospitalService: HospitalService,

     private router: Router
   ) {}
 
   ngOnInit(): void {
     this.fetchMedecins();
     this.fetchHospitals();
   }
 
   fetchMedecins(): void {
     this.loading = true;
     this.errorMessage = null;
 
     this.radiologigueService.getAll().subscribe({
       next: (response) => {
         this.radiologues = response.data || [];
         this.loading = false;
       },
       error: (error) => {
         this.errorMessage = 'Failed to fetch medecins. Please try again later.';
         this.loading = false;
         console.error('Error fetching medecins:', error);
       }
     });
   }
 
   fetchHospitals(): void {
     this.hospitalService.getAll().subscribe({
       next: (response) => {
         this.hospitals = response.hospitals || [];
       },
       error: (error) => {
         console.error('Error fetching hospitals:', error);
       }
     });
   }
 
   openAddOverlay(): void {
     this.tempUserData = {  role: 'radioloque',
       first_name: '',
       last_name: '',
       username: '',
       password:'',
       date_de_naissance: new Date(),
       NSS: 0,
       mutuelle: '',
       adresse: '',
       telephone: '',
       email: '',
       hospital: 0, };
 
     this.editMode = true;
   }
 
   saveChanges(): void {
     console.log(this.tempUserData);
    // Call the service to add a new hospital
    this.medecinService.addMedecin(this.tempUserData).subscribe({
     next: (response: any) => {
       console.log('laborantin added successfully', response);
       // You can reload or update the list of hospitals here
       this.fetchMedecins(); // Assuming this fetches updated data
       this.router.navigate(['/listradiologue']);
 
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
 
   editMedecin(medecin: User): void {
    // this.tempUserData = { ...medecin };
    // this.editMode = true;
   }
 
   deleteMedecin(id: number): void {
     // Add delete functionality if needed
   }

}
