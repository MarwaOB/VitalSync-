import { MedecinService } from './../../../services/medecin/medecin.service';
import { MedecinEditComponent } from './../../EditProfile/medecin-edit/medecin-edit.component';
import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient/patient.service';
import { Patient } from '../../../shared/models/Users/Patient';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HospitalService } from '../../../services/hospital/hospital.service';
import { Hospital } from '../../../shared/models/hospital';
import { User } from '../../../shared/models/Users/User';
import { Dpi } from '../../../shared/models/Dpi/Dpi';


@Component({
  selector: 'app-table-patients',
  imports: [CommonModule,FormsModule ],
  templateUrl: './table-patients.component.html',
  styleUrl: './table-patients.component.css'
})
export class TablePatientsComponent implements OnInit {
  patients: Patient[] = [];  // Store the patients
  filteredPatients: Patient[] = []; // Tableau pour stocker les patients filtrés
  searchId: any=0;
  searchNom: string = '';
  searchNss: any=0;
  searchDateNaissance: string = '';
  searchAdresse: string = '';
  searchTelephone: string = '';
  searchMutuelle: string = '';
  searchHopital: any=0;
  searchDateDebutHospitalisation: string = '';
  searchDateFinHospitalisation: string = '';

  errorMessage: string = '';
  medecins: User[] = [];
  hospitals: Hospital[] = [];
  editMode: boolean = false;
  creerMode: boolean = false;

  loading: boolean = false;
  tempUserData:  { role: string ,username: string; password: string; first_name: string;last_name: string; adresse: string; date_de_naissance: Date; hospital: number ;mutuelle: string;NSS: number;email: string;contact_person: string;telephone: string;  } = {
    role: 'patient',
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
    contact_person: '',

};
tempdpi:  { id_medecin: number; id_patient: number;  } = {

  id_medecin : 0,
  id_patient:0,

};


  constructor(
    private patientService: PatientService,
    private hospitalService: HospitalService,
    private medecinService: MedecinService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.fetchHospitals();
    this.fetchMedecins();
      this.filteredPatients = this.patients;  // Initialiser avec tous les patients

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
  fetchMedecins(): void {
    this.loading = true;
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
  fetchpatients(): void {
    this.loading = true;
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


  openAddOverlay(): void {
    this.tempUserData = {  role: 'patient',
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
      contact_person: '',

    };

    this.editMode = true;
  }

  creerDpi(): void {
    this.tempdpi = {
      id_patient: 0,
      id_medecin: 0,

    };

    this.creerMode = true;
  }


  saveChanges(): void {
    console.log(this.tempUserData);
   // Call the service to add a new hospital
   this.patientService.addPatient(this.tempUserData).subscribe({
    next: (response: any) => {
      console.log('patient added successfully', response);
      // You can reload or update the list of hospitals here
      this.loadPatients(); // Assuming this fetches updated data
      this.router.navigate(['/listpatient']);

    },
    error: (error: any) => {
      console.error('Error adding hospital', error);
    }
  });
  this.editMode = false;
  }
  saveChanges1(): void {
    console.log(this.tempdpi);
  //  // Call the service to add a new hospital
  //  this.patientService.addPatient(this.tempUserData).subscribe({
  //   next: (response: any) => {
  //     console.log('patient added successfully', response);
  //     // You can reload or update the list of hospitals here
  //     this.loadPatients(); // Assuming this fetches updated data
  //     this.router.navigate(['/listpatient']);

  //   },
  //   error: (error: any) => {
  //     console.error('Error adding hospital', error);
  //   }
  // });
  this.editMode = false;

  }
  cancelEdit(): void {
    this.editMode = false;
    this.creerMode=false ;
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
   // this.router.navigate(['/patient-edit', patientId]);  // Redirect to the edit patient page
    //console.log('Editing patient with ID:', patientId);
  }

  deletePatient(id: number): void {
   // console.log('Deleting patient with ID:', id);
    // Here, you should call a service method to delete the patient and update the patients list after deletion
  }


  filtrer(): void {
    this.filteredPatients = this.patients.filter(patient => {
      return (
        (this.searchId ? patient.id === this.searchId : true) &&
        (this.searchNom ? patient.user.first_name.toLowerCase() === this.searchNom.toLowerCase() : true) &&
        (this.searchNss ? patient.user.NSS.toString() === this.searchNss : true) &&
        (this.searchDateNaissance ? patient.user.date_de_naissance == this.formatDate(this.searchDateNaissance.trim()) : true) &&
        (this.searchAdresse ? patient.user.adresse.toLowerCase() === this.searchAdresse.toLowerCase() : true) &&
        (this.searchTelephone ? patient.person_a_contacter_telephone === this.searchTelephone : true)
        // &&
        //(this.searchMutuelle ? patient.mutuelle.toLowerCase() === this.searchMutuelle.toLowerCase() : true) &&
        //(this.searchHopital ? patient.hopital.toLowerCase() === this.searchHopital.toLowerCase() : true) &&
        //(this.searchDateDebutHospitalisation ? patient.dateDebutHospitalisation.toISOString().slice(0, 10) === this.formatDate(this.searchDateDebutHospitalisation.trim()) : true) &&
        //(this.searchDateFinHospitalisation ? patient.dateFinHospitalisation.toISOString().slice(0, 10) === this.formatDate(this.searchDateFinHospitalisation.trim()) : true)
      );
    });
  }

  private formatDate(dateString: string): string {
    const [day, month, year] = dateString.split('/'); // Séparer la date en jour, mois, et année
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Reconstruire la date au format YYYY-MM-DD
  }

}

