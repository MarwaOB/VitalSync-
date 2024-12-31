import { Injectable } from '@angular/core';
import { Antecedent } from '../../../shared/models/Dpi/Antecedent';
import { Patient } from '../../../shared/models/Users/Patient';
import { Medecin } from '../../../shared/models/Users/Medecin';
import { Dpi } from '../../../shared/models/Dpi/Dpi';
import { AntecedentService } from '../Antecedent/antecedent.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DossierPatientService 
{
  private patient: Patient | null = null;
  private medecin: Medecin | null = null;
  private dp: Dpi | null = null;

  private apiUrl = 'http://127.0.0.1:8000/show_dpi'; // Base API URL from Django
  private apiUrl1 = 'http://127.0.0.1:8000/CreerDpi'; // Base API URL from Django

  constructor(private http: HttpClient) {}
    getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true }); // Include cookies with the request
  }

  addDpi(newDpi: {
    medecin_id :number ;
    patient_id :number ;

   }): Observable<any> {
     console.log(newDpi)
     return this.http.post<any>(this.apiUrl1, newDpi, { withCredentials: true });
   }

   
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
