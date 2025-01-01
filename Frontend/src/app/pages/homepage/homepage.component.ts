import { Component } from '@angular/core'
//import { MenuComponent } from '../menu/menu.component'
import { Router } from '@angular/router';  // Assurez-vous que le Router est importé

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})

export class HomepageComponent {
  constructor(private router: Router) {}  // Injecter le Router

  // Définir la méthode goToLogin pour naviguer
  goToLogin() {
    this.router.navigate(['/signin']);  // Naviguer vers la route de login
  }
  gotoContact() {
    this.router.navigate(['/contact']);  // Naviguer vers la route de login
  }
  gotoHome() {
    this.router.navigate(['']);  // Naviguer vers la route de login
  }
}
