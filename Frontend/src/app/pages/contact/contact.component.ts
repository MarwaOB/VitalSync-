import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Assurez-vous que le Router est importé

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  constructor(private router: Router) {}  // Injecter le Router

  gotoHome() {
    this.router.navigate(['']);  // Naviguer vers la route de login
  }
  goToLogin() {
    this.router.navigate(['/signin']);  // Naviguer vers la route de login
  }
  gotoContact() {
    this.router.navigate(['/contact']);  // Naviguer vers la route de login
  }
}
