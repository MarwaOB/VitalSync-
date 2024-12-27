import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Diagnostic } from './../../../shared/models/Dpi/Diagnostic';
import { Consultation } from '../../../shared/models/Dpi/Consultation';
import { Medicament } from './../../../shared/models/Dpi/Medicament';
import { Ordonnance } from './../../../shared/models/Dpi/Ordonnance';
import { ConsultationService } from '../../../services/DossierPatient/Consultation/consultation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.component.html',
  styleUrls: ['./diagnostic.component.css'],
  imports: [CommonModule, FormsModule]
})
export class DiagnosticComponent implements OnInit {
  @Input() diagnostic: Diagnostic | null = null;
  @Input() consultation: Consultation | null = null;

  ordonnance: Ordonnance | null = null;
  medicaments: Medicament[] = [];
  editMode: boolean = false;
  editMedicamentMode: boolean = false;
  selectedMedicament: any = null;
  isAddingMedicament = false;

  temp: Ordonnance = {
    id: '',
    diagnosticId: '',
    duree: '',
    isValid: false
  };

  constructor(private consultationService: ConsultationService) { }

  ngOnInit(): void {
    if (this.diagnostic) {
      this.loadOrdonnance();
      this.loadMedicaments();
    }
  }

  //  a mettre dans le service ( on recupere lordonnance )
  loadOrdonnance(): void {
    if (this.diagnostic?.ordonnanceId) {
      this.ordonnance = this.consultationService.Ordonnances.find(
        ord => ord.id === this.diagnostic?.ordonnanceId
      ) || null;
    }
  }


  // meme chose il faut la mettre dans le service ( on recupere les medicaments asscoies a cette ordonnance)
  loadMedicaments(): void {
    if (this.ordonnance) {
      this.medicaments = this.consultationService.Medicamenta.filter(
        med => med.ordonnanceId === this.ordonnance!.id
      );
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;

    if (!this.ordonnance) {
      const newId = `ORD${Math.floor(Math.random() * 100000)}`;
      this.ordonnance = {
        id: newId,
        duree: '',
        isValid: false,
        diagnosticId: this.diagnostic?.id || ''
      };
      if (this.diagnostic) {
        this.diagnostic.ordonnanceId = newId;
      }
    }

    if (this.editMode && this.ordonnance) {
      this.temp = { ...this.ordonnance };
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.temp = { id: '', diagnosticId: '', duree: '', isValid: false }; // Réinitialise temp
  }

  // il faut la mettre dans le service aussi + la varialble doit etre modifiee globalement 
  saveChanges(): void {
    if (this.ordonnance) {
      this.ordonnance.duree = this.temp.duree;
      this.ordonnance.isValid = this.temp.isValid;
      this.editMode = false;
    }
  }

  ajouterMedicament() {
    this.selectedMedicament = {
      id: null,
      nom: '',
      duree: '',
      dose: '',
      dosePrise: '',
      dosePrevues: '',
    };
    this.isAddingMedicament = true;
    this.editMedicamentMode = true;
  }

  // service 
  supprimer(medicamentId: string): void {
    this.medicaments = this.medicaments.filter(med => med.id !== medicamentId);
  }

  //service
  modifierMedicament(medicament: any) {
    this.selectedMedicament = { ...medicament };
    this.isAddingMedicament = false;
    this.editMedicamentMode = true;
  }
  cancelMedicamentEdit(): void {
    this.editMedicamentMode = false;
    this.selectedMedicament = null;
    this.isAddingMedicament = false;
  }
  //SERVICE 
  saveMedicamentChanges() {
    if (this.isAddingMedicament) {
      const newId = `MED$${Math.floor(Math.random() * 100000)}`;
      this.selectedMedicament.id = newId;
      this.medicaments.push(this.selectedMedicament);
    } else {
      const index = this.medicaments.findIndex(
        (med) => med.id === this.selectedMedicament.id
      );
      if (index > -1) {
        this.medicaments[index] = { ...this.selectedMedicament };
      }
    }

    this.cancelMedicamentEdit();
  }
}
