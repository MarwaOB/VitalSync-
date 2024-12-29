import { User } from './../../shared/models/Users/User';
import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header/header.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  //userProfile: UserProfile | null = null;
  user: any = null;

  constructor(private userService: UserService , private headerrService: HeaderService ,private router: Router) {

  }



  ngOnInit(): void {
    // Access user data directly or subscribe to changes
    this.user = this.userService.user;
  }



  logOut(): void {
    this.headerrService.logOut().subscribe({
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
