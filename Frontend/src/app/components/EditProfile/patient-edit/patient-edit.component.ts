import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Patient } from '../../../shared/models/Users/Patientt';
import { PatientService } from '../../../services/patient/patient.service';
import { ProfileComponent } from "../../profile/profile.component";
import { ProfilePatientComponent } from "../../profile-patient/profile-patient.component";

@Component({
  selector: 'app-patient-edit',
  imports: [ProfileComponent, CommonModule, ProfilePatientComponent],
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.css']
})
export class PatientEditComponent implements OnInit {
  patientId?: string;
  patientData?: Patient;

  constructor(private route: ActivatedRoute, private patientService: PatientService) { }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id')!;

    if (this.patientId) {
      this.patientService.getById(this.patientId).subscribe((patient) => {
        if (patient) {
          this.patientData = patient;
        } else {
          console.error('Patient non trouvé avec l\'ID:', this.patientId);
        }
      });
    }
  }
}
