import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Patient } from './../../shared/models/Users/Patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://127.0.0.1:8000/admin/patients/';  // API URL from Django

  constructor(private http: HttpClient) { }

  // Fetch the list of patients from the backend
  getPatients(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Fetch a single patient by ID
  getById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}${id}/`);
  }

  // Add a new patient
  add(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }
}
