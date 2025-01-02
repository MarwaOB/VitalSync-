import { Routes } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import { Page1AccueilComponent } from './pages/page1-accueil/page1-accueil.component';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { MenuComponent } from './components/menu/menu.component';

export const routes: Routes = 
[
    { path: "signin", component: SigninComponent },
    { path: "header", component: HeaderComponent },

    {
        path: "accueil",
        component: LayoutComponent, // Use layout component here
        children: [
          { path: "", component: Page1AccueilComponent } // Page1Accueil will be displayed inside the layout
        ]
      },
];