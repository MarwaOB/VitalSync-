import { Laborantin } from './../../../shared/models/Users/Laborantin';
import { Medecin } from './../../../shared/models/Users/Medecin';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../shared/models/Users/User';
import { LaborantinService } from '../../../services/laborantin/laborantin.service';
import { HospitalService } from '../../../services/hospital/hospital.service';
import { Hospital } from '../../../shared/models/hospital';
import { MedecinService } from '../../../services/medecin/medecin.service';
import { FormsModule, NgModel } from '@angular/forms';
@Component({
  selector: 'app-table-laborantins',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-laborantins.component.html',
  styleUrl: './table-laborantins.component.css'
})
export class TableLaborantinsComponent {
  laborantins: any[] = [];
  filteredPharmaciens: User[] = [];
  searchId: string = '';
  searchNom: string = '';
  searchNss: string = '';
  searchDateNaissance: string = '';
  searchAdresse: string = '';
  searchTelephone: string = '';
  searchMutuelle: string = '';
  searchHopital:any=0;

  // Array to hold medecins data
     loading: boolean = false; // Loading indicator
     errorMessage: string | null = null; // Error message holder
   medecins: User[] = [];
     hospitals: Hospital[] = [];
     editMode: boolean = false;
     tempUserData:  { role: string ,username: string; password: string; first_name: string;last_name: string; adresse: string; date_de_naissance: Date; hospital: number ;mutuelle: string;NSS: number;email: string;telephone: string;  } = {
       role: 'laborantin',
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
       private laboratinService: LaborantinService,

       private hospitalService: HospitalService,

       private router: Router
     ) {}

     ngOnInit(): void {
       this.fetchMedecins();
       this.fetchHospitals();
       this.filteredPharmaciens = this.medecins;  // Initialisation avec tous les pharmaciens

     }

     fetchMedecins(): void {
      this.loading = true;
      this.errorMessage = null;

      this.laboratinService.getAll().subscribe({
        next: (response: { data: never[]; }) => {
          this.laborantins = response.data || [];
          this.loading = false;
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to fetch medecins. Please try again later.';
          this.loading = false;
          console.error('Error fetching medecins:', error);
        }
      });}




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
       this.tempUserData = {  role: 'laborantin',
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
         this.router.navigate(['/listlaborantin']);

       },
       error: (error: any) => {
         console.error('Error adding laborantin', error);
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

     filtrer(): void {
      this.filteredPharmaciens = this.medecins.filter(pharmacien => {
        return (
          (this.searchId ? pharmacien.id.toString() === this.searchId.trim() : true) &&
          (this.searchNom ? pharmacien.first_name.toLowerCase().trim() === this.searchNom.toLowerCase().trim() : true) &&
          (this.searchNss ? pharmacien.NSS.toString() === this.searchNss.trim() : true) &&
          (this.searchDateNaissance ?
            pharmacien.date_de_naissance === this.formatDate(this.searchDateNaissance.trim()) : true) &&        (this.searchAdresse ? pharmacien.adresse.toLowerCase().trim() === this.searchAdresse.toLowerCase().trim() : true) &&    (this.searchAdresse ? pharmacien.adresse.toLowerCase().trim() === this.searchAdresse.toLowerCase().trim() : true) &&
          (this.searchTelephone ? pharmacien.telephone === this.searchTelephone.trim() : true) &&
          (this.searchMutuelle ? pharmacien.mutuelle.toLowerCase().trim() === this.searchMutuelle.toLowerCase().trim() : true) &&
          (this.searchHopital ? pharmacien.hospital == this.searchHopital : true)
        );
      });
    }
    private formatDate(dateString: string): string {
      const [day, month, year] = dateString.split('/'); // Séparer la date en jour, mois, et année
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Reconstruire la date au format YYYY-MM-DD
    }



}
