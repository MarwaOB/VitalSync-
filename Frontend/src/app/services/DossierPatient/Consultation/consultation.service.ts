import { Medicament } from './../../../shared/models/Dpi/Medicament';
import { Ordonnance } from './../../../shared/models/Dpi/Ordonnance';
import { Diagnostic } from './../../../shared/models/Dpi/Diagnostic';
import { BilanRadiologiqueComponent } from '../../../components/DossierPatient/bilan-radiologique/bilan-radiologique.component';
import { BilanBiologiqueComponent } from '../../../components/DossierPatient/bilan-biologique/bilan-biologique.component';
import { Injectable } from '@angular/core';
import { DossierPatientService } from '../Dp/dossier-patient.service';
import { Consultation } from '../../../shared/models/Dpi/Consultation';
import { Biologique } from '../../../shared/models/Dpi/BilanBiologique';
import { Radiologique } from '../../../shared/models/Dpi/BilanRadiologique';
import { Examen } from '../../../shared/models/Dpi/Examen';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  Consultations: Consultation[] = [{
    id: '1',
    date: new Date('2024-12-01'),
    dpiId: 'DPI001',
    resume: 'Résumé de la consultation 1',
    diagnosticId: 'DIAG001',
    bilanBiologiqueId: 'bilanBio1',
    bilanRadiologiqueId: 'bilanRadio1',
  },
  {
    id: '2',
    date: new Date('2024-12-02'),
    dpiId: 'DPI002',
    resume: 'Résumé de la consultation 2',
    diagnosticId: 'DIAG002',
    bilanBiologiqueId: 'bilanBio2',
    bilanRadiologiqueId: 'bilanRadio2',
  },
  {
    id: '3',
    date: new Date('2024-12-03'),
    dpiId: 'DPI003',
    resume: 'Résumé de la consultation 3',
    diagnosticId: '',
    bilanBiologiqueId: '',
    bilanRadiologiqueId: '',
  }];

  Diagnostics: Diagnostic[] = [
    { id: "DIAG001", ordonnanceId: "ORD001" },
    { id: "DIAG002", ordonnanceId: "ORD002" },
    { id: "DIAG003", ordonnanceId: "ORD003" }]

  Ordonnances: Ordonnance[] = [
    { id: "ORD001", diagnosticId: "DIAG001", isValid: true, duree: "1mois" },
    { id: "ORD002", diagnosticId: "DIAG002", isValid: true, duree: "2mois" },
    { id: "ORD003", diagnosticId: "DIAG003", isValid: true, duree: "3mois" },
  ]

  Medicamenta: Medicament[] = [
    { id: "MED001", nom: "nom1", duree: "1mois", dose: 10, dosePrise: 5, dosePrevues: 2, ordonnanceId: "ORD001" },
    { id: "MED002", nom: "nom2", duree: "1mois", dose: 10, dosePrise: 5, dosePrevues: 2, ordonnanceId: "ORD001" },
    { id: "MED003", nom: "nom3", duree: "1mois", dose: 10, dosePrise: 5, dosePrevues: 2, ordonnanceId: "ORD001" },

    { id: "MED004", nom: "nom4", duree: "1mois", dose: 10, dosePrise: 5, dosePrevues: 2, ordonnanceId: "ORD002" },
    { id: "MED005", nom: "nom5", duree: "1mois", dose: 10, dosePrise: 5, dosePrevues: 2, ordonnanceId: "ORD002" },

    { id: "MED006", nom: "nom6", duree: "1mois", dose: 10, dosePrise: 5, dosePrevues: 2, ordonnanceId: "ORD003" },
  ]

  BilanBiologiques: Biologique[] = [
    new Biologique("bilanBio1", 'biologique', new Date('2024-12-01'), 'LAB001', 'Description 1 Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1', 1.2, '120/80', 200),
    new Biologique("bilanBio2", 'biologique', new Date('2024-12-02'), 'LAB002', 'Description 2', 1.5, '130/90', 220),
    new Biologique("bilanBio3", 'biologique', new Date('2024-12-03'), 'LAB003', 'Description 3', 1.8, '110/70', 180),
  ];

  BilanRadiologiques: Radiologique[] = [
    new Radiologique("bilanRadio1", 'radiologique', new Date('2024-12-01'), 'RAD001'),
    new Radiologique("bilanRadio2", 'radiologique', new Date('2024-12-02'), 'RAD002'),
    new Radiologique("bilanRadio3", 'radiologique', new Date('2024-12-03'), 'RAD003'),
  ];
  exams: Examen[] = [
    { id: 'EXAM001', type: 'Hémogramme Complet', description: 'Analyse des cellules sanguines', images: "image1", bilanRadiologiqueId: "bilanRadio1" },
    { id: 'EXAM002', type: 'radiologique', description: 'Examen des poumons', images: "image2", bilanRadiologiqueId: "bilanRadio1" },
  ];

  private apiUrl = 'http://127.0.0.1:8000/ajouter_Consultation_api'; // Base API URL from Django

  constructor(private http: HttpClient,private dossierPatientService: DossierPatientService) { }
  
  addconsultation(newConsultaion: {
     resume: string,
    dpi_id: number

   }): Observable<any> {
     console.log(newConsultaion)
     return this.http.post<any>(this.apiUrl, newConsultaion, { withCredentials: true });
   }

  addConsultation(Consultation: Consultation): boolean {
    Consultation.id = (this.Consultations.length + 1).toString();
    const dpi = this.dossierPatientService.getDpi();
    if (dpi) {
      Consultation.dpiId = dpi.id;
    }
    this.Consultations.push(Consultation);
    return true;
  }
  getConsultations(): Consultation[] {
    return this.Consultations;
  }
  getConsultationById(id: string): Consultation | undefined {
    return this.Consultations.find(a => a.id === id);
  }
  updateConsultation(Consultation: Consultation): boolean {
    const index = this.Consultations.findIndex(a => a.id === Consultation.id);
    if (index !== -1) {
      this.Consultations[index] = Consultation;
      return true;
    }
    return false;
  }
  removeConsultation(ConsultationId: string): boolean {
    const index = this.Consultations.findIndex(a => a.id === ConsultationId);
    if (index !== -1) {
      this.Consultations.splice(index, 1); // Supprime l'antécédent par son index
      return true;
    }
    return false;
  }
  getDiagnostic(DiagnosticId: string): Diagnostic {
    const diagnostic = this.Diagnostics.find(a => a.id === DiagnosticId);
    if (!diagnostic) {
      throw new Error(`Diagnostic with ID ${DiagnosticId} not found`);
    }
    return diagnostic;
  }
  getBilanBiologique(bilanBiologiqueId: string): Biologique {
    const bilan = this.BilanBiologiques.find(bilan => bilan.id === bilanBiologiqueId);
    if (!bilan) {
      throw new Error(`Bilan Biologique with ID ${bilanBiologiqueId} not found`);
    }
    return bilan;
  }
  getBilanRadiologique(bilanRadiologiqueId: string): Radiologique {
    const bilan = this.BilanRadiologiques.find(bilan => bilan.id === bilanRadiologiqueId);
    if (!bilan) {
      throw new Error(`Bilan Radiologique with ID ${bilanRadiologiqueId} not found`);
    }
    return bilan;
  }
  updateConsultationWithId(consultation: Consultation, type: 'diagnostic' | 'bilanBio' | 'bilanRadio'): void {
    const idPrefix = type === 'diagnostic' ? 'DIAG' : type === 'bilanBio' ? 'BilanBio' : 'BilanRadio';
    const generatedId = `${idPrefix}${Math.floor(Math.random() * 100000)}`;

    if (type === 'diagnostic') {
      consultation.diagnosticId = generatedId;
      this.Diagnostics.push({ id: generatedId, ordonnanceId: '' });
    } else if (type === 'bilanBio') {
      consultation.bilanBiologiqueId = generatedId;
      this.BilanBiologiques.push(new Biologique(generatedId, 'biologique', new Date(), '', 'Nouvelle description', 0, '0', 0));
    } else if (type === 'bilanRadio') {
      consultation.bilanRadiologiqueId = generatedId;
      this.BilanRadiologiques.push(new Radiologique(generatedId, 'radiologique', new Date(), ''));
    }
    this.updateConsultation(consultation);
  }
  getExamsByBilanId(bilanId: string): Examen[] {
    return this.exams.filter(examen => examen.bilanRadiologiqueId === bilanId);
  }

}
