import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Profile {
  nom: string;
  prenom: string;
  date_de_naissance: string;
  age: number;
  email: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})



export class SigninService 
{
  private apiUrl = 'http://127.0.0.1:8000/user/signin'; // Ensure this matches your backend endpoint

  constructor(private http: HttpClient) { }
  signIn(username: string, password: string): Observable<any> {
    const credentials = { username, password };
    return this.http.post<any>(this.apiUrl, credentials, { withCredentials: true });
  }
  
  

 
}
