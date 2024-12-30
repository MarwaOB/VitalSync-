import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Hospital } from '../../shared/models/hospital';
import { HospitalService } from '../../services/hospital/hospital.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-hopital',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-hopital.component.html',
  styleUrls: ['./table-hopital.component.css']
})
export class TableHopitalComponent implements OnInit {

  Hospitals: Hospital[] = [];
   editMode: boolean = false;
   hospitals: any[] = []; // Array to hold medecins data
   loading: boolean = false; // Loading indicator
   errorMessage: string | null = null; // Error message holder
   temphospitalData: {  username: string; password: string;id: string; nom: string; lieu: string; dateCreation: Date; nombrePatients: number; nombrePersonnels: number; is_clinique: boolean; } = {
    id: '',
    nom: '',
    lieu: '',
    username: '',
    password:'',
    dateCreation: new Date(),
    nombrePatients: 0,
    nombrePersonnels: 0,
    is_clinique: false
};
 
  constructor(private hospitalService: HospitalService, private router: Router) { }
  ngOnInit(): void {
    this.fetchHospitals();
  }

  /**
   * Fetch all Hospitals from the service.
   */
  fetchHospitals(): void {
    this.loading = true;
    this.errorMessage = null;
  
    this.hospitalService.getAll().subscribe({
      next: (response) => {
        console.log(response);  // Log the full response for debugging
        this.hospitals = response.hospitals || [];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch hospitals. Please try again later.';
        this.loading = false;
        console.error('Error fetching hospitals:', error);
      }
    });
  }
  


  openAddOverlay(): void {
     this.editMode = true;
    this.temphospitalData = { username: '',password:'',id: '', nom: '', lieu: '', dateCreation: new Date(''), nombrePatients: 0, nombrePersonnels: 0, is_clinique: false };
   }
  addHospital(newHospital: Hospital): void {
    // this.HospitalService.add(newHospital).subscribe(() => {
    //   this.HospitalService.getAll().subscribe((hospitals: Hospital[]) => {
    //     this.Hospitals = hospitals;
    //   });
    // });
  }
  saveChanges(): void {
    // Call the service to add a new hospital
    this.hospitalService.addHospital(this.temphospitalData).subscribe({
      next: (response) => {
        console.log('Hospital added successfully', response);
        // You can reload or update the list of hospitals here
        this.fetchHospitals(); // Assuming this fetches updated data
        this.router.navigate(['/hopital']);

      },
      error: (error) => {
        console.error('Error adding hospital', error);
      }
    });
    this.editMode = false;
  }
  cancelEdit(): void {
    this.editMode = false;
  }

  editHospital(hospital: Hospital): void {
  //  this.temphospitalData = { ...hospital };
    //this.editMode = true;
  }

  deleteHospital(id: number): void {
  }

}
