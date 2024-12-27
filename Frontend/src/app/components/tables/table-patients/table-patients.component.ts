import { Component } from '@angular/core';
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
export class TablePatientsComponent {
  patients: Patient[] = [];
  constructor(private patientService: PatientService, private router: Router) { }



  
  ngOnInit(): void {

    // Appeler le service pour obtenir tous les patients
    this.patientService.getAll().subscribe((patients: Patient[]) => {
      this.patients = patients;  // Stocker les patients dans le tableau
    });


    
  }
  voirDpi(patientId: string): void {
    this.router.navigate(['/patient-dpi', patientId]);  // Redirection vers la page du DPI du patient
  }

  editPatient(patientId: string): void {
    this.router.navigate(['/patient-edit', patientId]);  // Redirection vers la page du edit du patient
    console.log('Édition du patient avec ID:', patientId);
  }

  deletePatient(id: string): void {
    console.log('Suppression du patient avec ID:', id);
  }

}
