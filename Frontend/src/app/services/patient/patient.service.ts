import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Patient } from './../../shared/models/Users/Patientt';
import { Dpi } from '../../shared/models/Dpi/Dpi';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://127.0.0.1:8000/patients/';  // API URL from Django
  private apiUrl1 = 'http://127.0.0.1:8000/usersadd'; // Base API URL from Django
  private apiUrl2 = 'http://127.0.0.1:8000/Patients_No_Dpi'; // Base API URL from Django



  constructor(private http: HttpClient, private userService: UserService) {}

getPatients(): Observable<any> {
  const userRole = this.userService.user?.role; // Access the user's role
  const userId = this.userService.user?.hospital?.id; // Access the user's id
  const urlWithParams = `${this.apiUrl}?role=${userRole}&id=${userId}`; // Append both role and id as query parameters
  
  return this.http.get<any>(urlWithParams, { withCredentials: true }); // Make the request with the modified URL
}

  getPatients_by_role(): Observable<any> {
    return this.http.get<any>(this.apiUrl2, { withCredentials: true });  // Include cookies with the request
  }

  // Fetch a single patient by ID
  getById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}${id}/`, { withCredentials: true });
  }

  addDpiPatient(patientId: string, dpi: Dpi): Observable<boolean> 
  {
    
    return of(true);
  }
  addPatient(newPatient: {
    role: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    adresse: string;
    date_de_naissance: Date;
    hospital: number;
    mutuelle: string;
    NSS: number;
    email: string;
    telephone: string;
   }): Observable<any> {
     console.log(newPatient)
     return this.http.post<any>(this.apiUrl1, newPatient, { withCredentials: true });
   }
}
