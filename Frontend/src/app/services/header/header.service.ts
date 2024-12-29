import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

export interface UserProfile {
  name: string;
  email: string;
  profilePhoto: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private apiUrl = 'http://127.0.0.1:8000/user/logout';  // Adjust the URL to match your backend endpoint

  constructor(private http: HttpClient) { }

  private userProfileSubject = new BehaviorSubject<UserProfile>({
    name: 'AYA LAKACHE',
    email: 'ma_lakache@gmail.com',
    profilePhoto: 'assets/images/header/profilepic1.svg'
  });

  userProfile$ = this.userProfileSubject.asObservable();

  updateUserProfile(profile: UserProfile) {
    this.userProfileSubject.next(profile);
  }
  logOut(): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/log_out/', {}).pipe(
      catchError(error => {
        console.error('Logout request failed', error);
        return throwError(error);
      })
    );
  }

  
}
