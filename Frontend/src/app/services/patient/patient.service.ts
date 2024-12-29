import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Patient } from './../../shared/models/Users/Patientt';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://127.0.0.1:8000/patients/';  // API URL from Django

  constructor(private http: HttpClient) { }


  getPatients(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true });  // Include cookies with the request
  }

  // Fetch a single patient by ID
  getById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}${id}/`, { withCredentials: true });
  }

  // Add a new patient
  add(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient, { withCredentials: true });
  }
}
