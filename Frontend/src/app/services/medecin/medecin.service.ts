import { Injectable } from '@angular/core';
import { User } from '../../shared/models/Users/User';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  
  private apiUrl = 'http://127.0.0.1:8000/users/'; // Base API URL from Django
  private apiUrl1 = 'http://127.0.0.1:8000/usersadd'; // Base API URL from Django

  constructor(private http: HttpClient) {}

  /**
   * Fetch all users with the role "medecin".
   * @returns Observable containing a list of users with the role "medecin".
   */
  getAll(): Observable<any> {
    const role = 'medecin';
    const urlWithRole = `${this.apiUrl}?role=${role}`; // Append the role query parameter
    return this.http.get<any>(urlWithRole, { withCredentials: true }); // Include cookies with the request
  }

  /**
   * Fetch a specific user by ID.
   * @param id The ID of the user to fetch.
   * @returns Observable containing the user data or undefined.
   */
  getById(id: string): Observable<User | undefined> {
    return this.http.get<User>(`${this.apiUrl}${id}/`, { withCredentials: true });
  }

  /**
   * Add a new "medecin" user.
   * @param medecin The user object representing the new "medecin".
   * @returns Observable containing the newly created user data.
   */
 
   

     addMedecin(newMedecin: {
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
       console.log(newMedecin)
       return this.http.post<any>(this.apiUrl1, newMedecin, { withCredentials: true });
     }
}