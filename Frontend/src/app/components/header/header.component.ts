import { Component, OnInit } from '@angular/core';
import { HeaderService, UserProfile } from '../../services/header/header.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userProfile!: UserProfile;

  constructor(private headerService: HeaderService , private router: Router) {

  }

  ngOnInit(): void {
    this.headerService.userProfile$.subscribe(profile => {
      this.userProfile = profile;
    });
  }



  logOut(): void {
    this.headerService.logOut().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          console.log(response.message);  // Logged out successfully
          // Optionally, navigate to the login page or home page
          this.router.navigate(['']);
        } else {
          console.error(response.message);  // Handle error case
        }
      },
      error: (error) => {
        console.error('Logout failed', error);  // Handle error case
      },
      complete: () => {
        console.log('Logout request completed');
      }
    });
  }

}
