import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SigninComponent } from './components/signin/signin.component';
import { Page1AccueilComponent } from './pages/page1-accueil/page1-accueil.component';
import { PatientDpiComponent } from './components/patient-dpi/patient-dpi.component';
import { PatientEditComponent } from './components/EditProfile/patient-edit/patient-edit.component';
import { MedecinEditComponent } from './components/EditProfile/medecin-edit/medecin-edit.component';
import { BiologisteEditComponent } from './components/EditProfile/biologiste-edit/biologiste-edit.component';
import { InfirmierEditComponent } from './components/EditProfile/infirmier-edit/infirmier-edit.component';
import { LaborantinEditComponent } from './components/EditProfile/laborantin-edit/laborantin-edit.component';
import { PharmacienEditComponent } from './components/EditProfile/pharmacien-edit/pharmacien-edit.component';
import { RadiologueEditComponent } from './components/EditProfile/radiologue-edit/radiologue-edit.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ContactComponent } from './pages/contact/contact.component';
import { MenuComponent } from './pages/menu/menu.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfilePatientComponent } from './components/profile-patient/profile-patient.component';
import { ProfiletemplateComponent } from './components/profiletemplate/profiletemplate.component';
import { ListpatientComponent } from './pages/listpatient/listpatient.component';
import { ListmedecinComponent } from './pages/listmedecin/listmedecin.component';
import { ListpharmaComponent } from './pages/listpharma/listpharma.component';
import { ListlaborantinComponent } from './pages/listlaborantin/listlaborantin.component';
import { ListradiologueComponent } from './pages/listradiologue/listradiologue.component';
import { ListbiologistesComponent } from './pages/listbiologistes/listbiologistes.component';
import { ListinfermierComponent } from './pages/listinfermier/listinfermier.component';
import { AntecedentComponent } from './components/DossierPatient/antecedent/antecedent.component';
import { AdminSysEditComponent } from './components/EditProfile/admin-sys-edit/admin-sys-edit.component';
import { AdminCentralEditComponent } from './components/EditProfile/admin-central-edit/admin-central-edit.component';
import { ListhopitalComponent } from './pages/listhopital/listhopital.component';

export const routes: Routes = 
[
    { path: "", component: SigninComponent },
    { path: "header", component: HeaderComponent },
    //{ path: "accueil", component: Page1AccueilComponent } ,// Page1Accueil will be displayed inside the layout

    {
        path: "accueil",
        component: LayoutComponent, // Use layout component here
        children: [
          { path: "", component: Page1AccueilComponent } // Page1Accueil will be displayed inside the layout
        ]
      },
    { path: 'patient-edit/:id', component: PatientEditComponent }, // Route dynamique avec ID de patient
    { path: 'medecin-edit/:id', component: MedecinEditComponent }, // Route dynamique avec ID de patient
    { path: 'biologiste-edit/:id', component: BiologisteEditComponent }, // Route dynamique avec ID de medecin
    { path: 'infirmier-edit/:id', component: InfirmierEditComponent },
    { path: 'laborantin-edit/:id', component: LaborantinEditComponent },
    { path: 'pharmacien-edit/:id', component: PharmacienEditComponent },
    { path: 'radiologue-edit/:id', component: RadiologueEditComponent },
    {path: 'homepage',component: HomepageComponent },
    {path: 'contact', component: ContactComponent},
    {path: 'menu', component: MenuComponent},
    {path: 'profile', component: ProfilePatientComponent},

    {
      path: "patient-dpi/:id",
      component: LayoutComponent, // Use layout component here
      children: [
        { path: "", component:  PatientDpiComponent  } // Page1Accueil will be displayed inside the layout
      ]
    },


    {
      path: "profileadmin",
      component: LayoutComponent, // Use layout component here
      children: [
        { path: "", component: ProfiletemplateComponent } // Page1Accueil will be displayed inside the layout
      ]
    },
    {
      path: "listpatient",
      component: LayoutComponent, // Use layout component here
      children: [
        { path: "", component: ListpatientComponent } // Page1Accueil will be displayed inside the layout
      ]
    },
    {
      path: "listmedecin",
      component: LayoutComponent, // Use layout component here
      children: [
        { path: "", component: ListmedecinComponent  } // Page1Accueil will be displayed inside the layout
      ]
    },
    {
      path: "listpharma",
      component: LayoutComponent, // Use layout component here
      children: [
        { path: "", component: ListpharmaComponent } // Page1Accueil will be displayed inside the layout
      ]
    },
    {
      path: "profile",
      component: LayoutComponent, // Use layout component here
      children: [
        { path: "", component: ProfileComponent } // Page1Accueil will be displayed inside the layout
      ]
    },
    {
      path: "hopital",
      component: LayoutComponent, // Use layout component here
      children: [
        { path: "", component: ListhopitalComponent } // Page1Accueil will be displayed inside the layout
      ]
    },
    {
      path: "listlaborantin",
      component: LayoutComponent, // Use layout component here
      children: [
        { path: "", component: ListlaborantinComponent } // Page1Accueil will be displayed inside the layout
      ]
    },
    {
      path: "listradiologue",
      component: LayoutComponent, // Use layout component here
      children: [
        { path: "", component: ListradiologueComponent } // Page1Accueil will be displayed inside the layout
      ]
    },
    {
      path: "listbiologiste",
      component: LayoutComponent, // Use layout component here
      children: [
        { path: "", component: ListbiologistesComponent } // Page1Accueil will be displayed inside the layout
      ]
    },
    {
      path: "listinfermier",
      component: LayoutComponent, // Use layout component here
      children: [
        { path: "", component: ListinfermierComponent } // Page1Accueil will be displayed inside the layout
      ]
    },
    { path: 'AdminCentral-edit/:id', component: AdminCentralEditComponent },
    { path: 'AdminSys-edit/:id', component: AdminSysEditComponent },


  
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Import RouterModule here
  exports: [RouterModule] // Make sure RouterModule is exported
})
export class AppRoutes { }