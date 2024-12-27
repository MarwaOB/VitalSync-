import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Biologique } from '../../../shared/models/Dpi/BilanBiologique';
import { Consultation } from '../../../shared/models/Dpi/Consultation';
import { ConsultationService } from '../../../services/DossierPatient/Consultation/consultation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bilan-biologique',
  templateUrl: './bilan-biologique.component.html',
  styleUrls: ['./bilan-biologique.component.css'],
  imports: [CommonModule, FormsModule]
}) export class BilanBiologiqueComponent {
  @Input() consultation: Consultation | null = null;
  @Input() bilanBiologique: Biologique | null = null;

  temp: Biologique = {
    id: '',
    bilanType: 'biologique',
    date: new Date(),
    laborantinId: '',
    description: '',
    tauxGlycemie: 0,
    tauxPressionArterielle: '',
    tauxCholesterol: 0,
  };

  editMode = false;

  ngOnInit(): void {
    if (this.bilanBiologique?.id) {
      this.temp = { ...this.bilanBiologique };
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;

    if (this.editMode && this.bilanBiologique) {
      this.temp = { ...this.bilanBiologique };
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.temp = {
      id: this.bilanBiologique?.id || '',
      bilanType: this.bilanBiologique?.bilanType || 'biologique',
      date: this.bilanBiologique?.date || new Date(),
      laborantinId: this.bilanBiologique?.laborantinId || '',
      description: this.bilanBiologique?.description || '',
      tauxGlycemie: this.bilanBiologique?.tauxGlycemie || 0,
      tauxPressionArterielle: this.bilanBiologique?.tauxPressionArterielle || '',
      tauxCholesterol: this.bilanBiologique?.tauxCholesterol || 0,
    };
  }

  saveChanges(): void {
    console.log(this.bilanBiologique?.id);
    if (this.bilanBiologique?.id) {
      this.bilanBiologique = { ...this.temp };
      this.editMode = false;
    }
  }
}
