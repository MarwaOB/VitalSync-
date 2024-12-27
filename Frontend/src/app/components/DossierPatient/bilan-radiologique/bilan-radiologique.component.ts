import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { Consultation } from '../../../shared/models/Dpi/Consultation';
import { Radiologique } from '../../../shared/models/Dpi/BilanRadiologique';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Examen } from '../../../shared/models/Dpi/Examen';
import { ConsultationService } from '../../../services/DossierPatient/Consultation/consultation.service';

@Component({
  selector: 'app-bilan-radiologique',
  imports: [CommonModule, FormsModule],
  templateUrl: './bilan-radiologique.component.html',
  styleUrl: './bilan-radiologique.component.css'
})

export class BilanRadiologiqueComponent {

  @Input() consultation: Consultation | null = null;
  @Input() bilanRadiologique: Radiologique | null = null;
  editExamenMode: boolean = false;
  selectedExamen: Examen = { id: '', type: '', description: '', images: '', bilanRadiologiqueId: '' };
  examens: Examen[] = [];


  temp: Radiologique = {
    id: '',
    bilanType: 'biologique',
    date: new Date(),
    radiologueId: "",
  };

  editMode = false;

  constructor(private consultationService: ConsultationService) { }

  ngOnInit(): void {
    if (this.bilanRadiologique?.id) {
      this.temp = { ...this.bilanRadiologique };
      this.loadExamens();
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;

    if (this.editMode && this.bilanRadiologique) {
      this.temp = { ...this.bilanRadiologique };
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.temp = {
      id: this.bilanRadiologique?.id || '',
      bilanType: this.bilanRadiologique?.bilanType || 'biologique',
      date: this.bilanRadiologique?.date || new Date(),
      radiologueId: this.bilanRadiologique?.radiologueId || ""
    };
  }

  saveChanges(): void {
    console.log(this.bilanRadiologique?.id);
    if (this.bilanRadiologique?.id) {
      this.bilanRadiologique = { ...this.temp };
      this.editMode = false;
    }
  }
  genererIdUnique(): string {
    return `EXAM${Math.floor(Math.random() * 100000)}`;
  }
  ajouterExamen(): void {
    this.selectedExamen = { id: '', type: '', description: '', images: '', bilanRadiologiqueId: this.bilanRadiologique?.id || '' };
    this.editExamenMode = true;
  }

  modifierExamen(examen: Examen): void {
    this.selectedExamen = { ...examen };
    this.editExamenMode = true;
  }

  supprimerExamen(id: string): void {
    const index = this.examens.findIndex(examen => examen.id === id);
    if (index !== -1) {
      this.examens.splice(index, 1);  // Remove the exam from the array
    }
  }
  cancelExamenEdit(): void {
    this.editExamenMode = false;
    this.selectedExamen = { id: '', type: '', description: '', images: '', bilanRadiologiqueId: this.bilanRadiologique?.id || '' };
  }

  saveExamenChanges(): void {
    if (this.selectedExamen.id) {
      const index = this.examens.findIndex(exam => exam.id === this.selectedExamen.id);
      if (index !== -1) {
        this.examens[index] = { ...this.selectedExamen };
      }
    } else {
      this.selectedExamen.id = `EXAM${Math.floor(Math.random() * 100000)}`;
      this.examens.push(this.selectedExamen);
    }
    this.cancelExamenEdit();
  }

  loadExamens(): void {
    if (this.bilanRadiologique?.id) {
      this.examens = this.consultationService.getExamsByBilanId(this.bilanRadiologique.id);
      console.log('Examens chargés :', this.examens);
    }
  }


}
