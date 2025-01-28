import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

interface UserData {
  id:number;
  nss: number ;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  date_de_naissance: string | null;
  adresse: string;
  telephone: string;
  mutuelle: string | null;
  hospital: { name: string; location: string; id: number } | null;
  patient_data?: any; // For patient-specific data if available
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/user/signin';
  private userSubject = new BehaviorSubject<UserData | null>(this.getUserFromLocalStorage());
  user$ = this.userSubject.asObservable();
  constructor(private http: HttpClient) {}

  signIn(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(this.apiUrl, body);
  }

  setUserData(userData: UserData) {
    this.userSubject.next(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data in localStorage
  }

  clearUserData() {
    this.userSubject.next(null);
    localStorage.removeItem('user'); // Remove user data from localStorage
  }

  getUserFromLocalStorage(): UserData | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  get user() {
    return this.userSubject.value;
  }
}