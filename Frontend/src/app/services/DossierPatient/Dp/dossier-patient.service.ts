import { Injectable } from '@angular/core';
import { Antecedent } from '../../../shared/models/Dpi/Antecedent';
import { Patient } from '../../../shared/models/Users/Patient';
import { Medecin } from '../../../shared/models/Users/Medecin';
import { Dpi } from '../../../shared/models/Dpi/Dpi';
import { AntecedentService } from '../Antecedent/antecedent.service';

@Injectable({
  providedIn: 'root'
})
export class DossierPatientService 
{
  private patient: Patient | null = null;
  private medecin: Medecin | null = null;
  private dp: Dpi | null = null;

  constructor() { }

  setPatient(patient: Patient): void {
    this.patient = patient;
  }
  setMedecin(medecin: Medecin): void {
    this.medecin = medecin;
  }

  setDpi(dpi: Dpi): void {
    this.dp = dpi;
  }
  getPatient(): Patient | null {
    return this.patient;
  }
  getMedecin(): Medecin | null {
    return this.medecin;
  }
  getDpi(): Dpi | null {
    return this.dp;
  }
}
