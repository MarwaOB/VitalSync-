import { Component } from '@angular/core';

import { HeaderComponent } from '../../components/header/header.component';
import { routes } from '../../app.routes';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-page1-accueil',
  imports: [],
  templateUrl: './page1-accueil.component.html',
  styleUrl: './page1-accueil.component.css'
})
export class Page1AccueilComponent {
  constructor() {
    console.log('Page1 Accueil est affichée');
  }
}
