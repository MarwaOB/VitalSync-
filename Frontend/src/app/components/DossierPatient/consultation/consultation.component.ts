import { Consultation } from './../../../shared/models/Dpi/Consultation';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DiagnosticComponent } from '../diagnostic/diagnostic.component';
import { BilanBiologiqueComponent } from '../bilan-biologique/bilan-biologique.component';
import { BilanRadiologiqueComponent } from '../bilan-radiologique/bilan-radiologique.component';
import { ConsultationService } from '../../../services/DossierPatient/Consultation/consultation.service';
import { Diagnostic } from '../../../shared/models/Dpi/Diagnostic';
import { Biologique } from '../../../shared/models/Dpi/BilanBiologique';
import { Radiologique } from '../../../shared/models/Dpi/BilanRadiologique';

@Component({
  selector: 'app-consultation',
  imports: [CommonModule, FormsModule, DiagnosticComponent, BilanBiologiqueComponent, BilanRadiologiqueComponent],
  templateUrl: './consultation.component.html',
  styleUrl: './consultation.component.css'
})
export class ConsultationComponent implements OnInit {

  consultations: Consultation[] = [];
  selectedConsultation: Consultation | null = null;
  selectedDiagnostic: Diagnostic | null = null;
  selectedBilanRadiologique: Radiologique | null = null;
  selectedBilanBiologique: Biologique | null = null;
  detailType: string = '';
  showDetails: boolean = false;
  currentComponent: string = '';

  constructor(private consultationService: ConsultationService) { }

  ngOnInit(): void {
    this.consultations = this.consultationService.getConsultations();
  }

  getShortDescription(description: string): string {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  }

  voirDetails(consultation: Consultation, type: string): void {
    this.selectedConsultation = consultation;
    this.detailType = type;
    this.showDetails = true;
  }

  voirComposantDetail(consultation: Consultation, type: string): void {
    this.selectedConsultation = consultation;
    this.currentComponent = type;
    if (type === 'diag' && consultation.diagnosticId) {
      this.selectedDiagnostic = this.consultationService.getDiagnostic(consultation.diagnosticId);
    }
    if (type === 'bilanRadio' && consultation.bilanRadiologiqueId) {
      this.selectedBilanRadiologique = this.consultationService.getBilanRadiologique(consultation.bilanRadiologiqueId);
    }
    if (type === 'bilanBio' && consultation.bilanBiologiqueId) {
      this.selectedBilanBiologique = this.consultationService.getBilanBiologique(consultation.bilanBiologiqueId);
    }
  }

  creerDiagnostic(consultation: Consultation): void {
    this.consultationService.updateConsultationWithId(consultation, 'diagnostic');
    this.consultations = this.consultationService.getConsultations();
    this.voirComposantDetail(consultation, 'diag');
  }

  creerBilanBio(consultation: Consultation): void {
    this.consultationService.updateConsultationWithId(consultation, 'bilanBio');
    this.consultations = this.consultationService.getConsultations();
    this.voirComposantDetail(consultation, 'bilanBio');
  }

  creerBilanRadio(consultation: Consultation): void {
    this.consultationService.updateConsultationWithId(consultation, 'bilanRadio');
    this.consultations = this.consultationService.getConsultations();
    this.voirComposantDetail(consultation, 'bilanRadio');
  }

  cancelShowDetails(): void {
    this.showDetails = false;
    this.currentComponent = '';
  }

  supprimer(id: string): void {
    const isDeleted = this.consultationService.removeConsultation(id);
    if (isDeleted) {
      this.consultations = this.consultationService.getConsultations();
    }
  }

  ajouterConsultation(): void {
  }
}
