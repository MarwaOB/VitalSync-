import { Injectable, OnInit } from '@angular/core';
import { Hospital } from '../../shared/models/hospital';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HospitalService {
  
  private hopital: Hospital | null = null;
 hospitals : Hospital[] | undefined 

   private apiUrl = 'http://127.0.0.1:8000/hospitals/'; // Base API URL from Django
   private apiUrl1 = 'http://127.0.0.1:8000/hospitals/add'; // Base API URL from Django

    constructor(private http: HttpClient) {}
  
    /**
     * Fetch all users with the role "medecin".
     * @returns Observable containing a list of users with the role "medecin".
     */
    getAll(): Observable<{hospitals: Hospital[]}> {
      
      return this.http.get<{hospitals: Hospital[]}>(this.apiUrl, { withCredentials: true }); // Include cookies with the request
    }
  

  
    addHospital(newHospital: {
      username: string;
      password: string;
      id: string;
      nom: string;
      lieu: string;
      dateCreation: Date;
      nombrePatients: number;
      nombrePersonnels: number;
      is_clinique: boolean;
    }): Observable<any> {
      console.log(newHospital)
      return this.http.post<any>(this.apiUrl1, newHospital, { withCredentials: true });
    }
  edit(updatedHospital: Hospital): Observable<Hospital | null> {
    // const index = this.hospitals.findIndex(h => h.id === updatedHospital.id);
    // if (index !== -1) {
    //   this.hospitals[index] = { ...this.hospitals[index], ...updatedHospital };
    //   return of(this.hospitals[index]);
    // }
     return of(null);
  }

}
