import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';  // Import RouterModule
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule,RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  submenuVisible: boolean = false;
user: any = null;

  constructor(private userService: UserService  ,private router: Router) {

  }



  ngOnInit(): void {
    // Access user data directly or subscribe to changes
    this.user = this.userService.user;
  }

  toggleSubmenu(event: Event): void {
    event.stopPropagation();
    this.submenuVisible = !this.submenuVisible;
  }
}
