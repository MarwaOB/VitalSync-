import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Antecedent } from '../../shared/models/Dpi/Antecedent';
import { AntecedentComponent } from "../DossierPatient/antecedent/antecedent.component";
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ConsultationComponent } from "../DossierPatient/consultation/consultation.component";
@Component({
  selector: 'app-patient-dpi',
  imports: [RouterOutlet, AntecedentComponent, NgIf, CommonModule, ConsultationComponent],
  templateUrl: './patient-dpi.component.html',
  styleUrl: './patient-dpi.component.css'
})

export class PatientDpiComponent implements OnInit {
  patientId?: string;
  // jai le id du patient 
  // set dpi de ce patient 
  selectedSection: string = 'antecedents';

  selectSection(section: string) 
  {
    this.selectedSection = section;
    console.log(`Selected section: ${this.selectedSection}`); // Log the selected section
  }
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // je vais recuperer  l'ID du patient depuis l'URL
    this.patientId = this.route.snapshot.paramMap.get('id')!;
    // apres on va recupere le reste des donnees relatives a ce dpi 
  }
}