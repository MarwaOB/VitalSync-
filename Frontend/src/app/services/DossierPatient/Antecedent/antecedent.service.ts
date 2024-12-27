import { Injectable } from '@angular/core';
import { Antecedent } from '../../../shared/models/Dpi/Antecedent';
import { DossierPatientService } from '../Dp/dossier-patient.service';

@Injectable({
  providedIn: 'root'
})
export class AntecedentService {

  antecedents: Antecedent[] = [
    {
      id: '1',
      titre: 'Chirurgie du genou',
      description: 'Patient a subi une chirurgie du genou suite à un accident Patient a subi une chirurgie du genou suite à un accident Patient a subi une chirurgie du genou suite à un accident.',
      isChirurgical: true,
      dpiId: "1"
    },
    {
      id: '2',
      titre: 'Hypertension artérielle',
      description: 'Diagnostic d’hypertension depuis 5 ans, sous traitement.',
      isChirurgical: false,
      dpiId: "1"
    },
    {
      id: '3',
      titre: 'Fracture de la clavicule',
      description: 'Fracture réparée avec succès après une chute.',
      isChirurgical: true,
      dpiId: "1"
    },
    {
      id: '4',
      titre: 'Asthme',
      description: 'Patient asthmatique depuis l’enfance, actuellement sous traitement.',
      isChirurgical: false,
      dpiId: "1"
    }
  ];

  constructor(private dossierPatientService: DossierPatientService) { }

  addAntecedent(antecedent: Antecedent): boolean {
    antecedent.id = (this.antecedents.length + 1).toString();
    const dpi = this.dossierPatientService.getDpi();
    if (dpi) {
      antecedent.dpiId = dpi.id;
    }
    this.antecedents.push(antecedent);
    return true;
  }
  getAntecedents(): Antecedent[] {
    return this.antecedents;
  }
  getAntecedentById(id: string): Antecedent | undefined {
    return this.antecedents.find(a => a.id === id);
  }
  updateAntecedent(updatedAntecedent: Antecedent): boolean {
    const index = this.antecedents.findIndex(a => a.id === updatedAntecedent.id);
    if (index !== -1) {
      this.antecedents[index] = updatedAntecedent;
      return true;
    }
    return false;
  }
  removeAntecedent(antecedentId: string): boolean {
    const index = this.antecedents.findIndex(a => a.id === antecedentId);
    if (index !== -1) {
      this.antecedents.splice(index, 1); // Supprime l'antécédent par son index
      return true;
    }
    return false;
  }
}
