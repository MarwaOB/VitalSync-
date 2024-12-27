import { Component } from '@angular/core';
import { TablePatientsComponent } from "../../components/tables/table-patients/table-patients.component";
import { TableInfirmiersComponent } from "../../components/tables/table-infirmiers/table-infirmiers.component";
import $ from 'jquery';

@Component({
  selector: 'app-listpatient',
  imports: [TablePatientsComponent,],
  templateUrl: './listpatient.component.html',
  styleUrl: './listpatient.component.css'
})
export class ListpatientComponent {




}
