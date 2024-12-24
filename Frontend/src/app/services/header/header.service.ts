import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';





export interface UserProfile {
  name: string;
  email: string;
  profilePhoto: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private userProfileSubject = new BehaviorSubject<UserProfile>({
    name: 'AYA LAKACHE',
    email: 'ma_lakache@gmail.com',
    profilePhoto: 'assets/images/header/profilepic1.svg'
  });

  userProfile$ = this.userProfileSubject.asObservable();

  updateUserProfile(profile: UserProfile) {
    this.userProfileSubject.next(profile);
  }
}
