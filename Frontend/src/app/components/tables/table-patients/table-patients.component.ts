import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient/patient.service';
import { Patient } from '../../../shared/models/Users/Patient';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-table-patients',
  imports: [CommonModule],
  templateUrl: './table-patients.component.html',
  styleUrl: './table-patients.component.css'
})
export class TablePatientsComponent implements OnInit {
  patients: Patient[] = [];  // Store the patients
  errorMessage: string = '';

  constructor(private patientService: PatientService, private router: Router) { }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe(
      (response) => {
        this.patients = response.patients;  // Store the patients data from the API
      },
      error => {
        this.errorMessage = 'Failed to load patients. Please try again later.';
        console.error('Error loading patients:', error);
      }
    );
  }

  voirDpi(patientId: number): void {
    this.router.navigate(['/patient-dpi', patientId]);  // Redirect to the patient's DPI page
  }

  editPatient(patientId: number): void {
    this.router.navigate(['/patient-edit', patientId]);  // Redirect to the edit patient page
    console.log('Editing patient with ID:', patientId);
  }

  deletePatient(id: number): void {
    console.log('Deleting patient with ID:', id);
    // Here, you should call a service method to delete the patient and update the patients list after deletion
  }
}

