//import { TableMedecinsComponent } from './table-medecins.component';
// src/app/components/table-medecins/table-medecins.component.ts
import { Component, OnInit } from '@angular/core';
import { MedecinService } from '../../../services/medecin/medecin.service';
import { User } from '../../../shared/models/Users/User';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HospitalService } from '../../../services/hospital/hospital.service';
import { Hospital } from '../../../shared/models/hospital';

@Component({
  selector: 'app-table-medecins',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-medecins.component.html',
  styleUrls: ['./table-medecins.component.css']
})
export class TableMedecinsComponent implements OnInit {
  medecins: User[] = [];
  hospitals: Hospital[] = [];
  editMode: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null;
  tempUserData:  { role: string ,username: string; password: string; first_name: string;last_name: string; adresse: string; date_de_naissance: Date; hospital: number ;mutuelle: string;NSS: number;email: string;telephone: string;  } = {
    role: 'medecin',
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
    this.tempUserData = {  role: 'medecin',
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
      console.log('Medecin added successfully', response);
      // You can reload or update the list of hospitals here
      this.fetchMedecins(); // Assuming this fetches updated data
      this.router.navigate(['/listmedecin']);

    },
    error: (error: any) => {
      console.error('Error adding hospital', error);
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
