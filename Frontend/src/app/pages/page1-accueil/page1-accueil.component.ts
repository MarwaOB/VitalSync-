import { Component } from '@angular/core';
import { TablePatientsComponent } from '../../components/tables/table-patients/table-patients.component';
import { TableMedecinsComponent } from '../../components/tables/table-medecins/table-medecins.component';
import { TableInfirmiersComponent } from "../../components/tables/table-infirmiers/table-infirmiers.component";
import { TablePharmComponent } from "../../components/tables/table-pharm/table-pharm.component";
import { TableLaborantinsComponent } from "../../components/tables/table-laborantins/table-laborantins.component";
import { TableRadiologuesComponent } from "../../components/tables/table-radiologues/table-radiologues.component";
import { HeaderComponent } from "../../components/header/header.component";
import { MenuComponent } from "../../components/menu/menu.component";
import { LayoutComponent } from "../../components/layout/layout.component";
import { AntecedentComponent } from "../../components/DossierPatient/antecedent/antecedent.component";
import { ConsultationComponent } from "../../components/DossierPatient/consultation/consultation.component";
import { ProfileComponent } from "../../components/profile/profile.component";
import { ProfilePatientComponent } from "../../components/profile-patient/profile-patient.component";

@Component({
  selector: 'app-page1-accueil',
  imports: [TablePatientsComponent, TableMedecinsComponent, TableInfirmiersComponent, TablePharmComponent, TableLaborantinsComponent, TableRadiologuesComponent, HeaderComponent, MenuComponent, LayoutComponent, AntecedentComponent, ConsultationComponent, ProfileComponent, ProfilePatientComponent],
  templateUrl: './page1-accueil.component.html',
  styleUrl: './page1-accueil.component.css'
})
export class Page1AccueilComponent {
  constructor() {
    console.log('Page1 Accueil est affichée');
  }
}
