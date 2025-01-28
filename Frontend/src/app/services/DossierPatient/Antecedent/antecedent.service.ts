import { Injectable } from '@angular/core';
import { Antecedent } from '../../../shared/models/Dpi/Antecedent';
import { DossierPatientService } from '../Dp/dossier-patient.service';
import { Observable } from 'rxjs';
import { ShareddpiService } from '../../shareddpi/shareddpi.service';
import { HttpClient } from '@angular/common/http';

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
  private apiUrl = 'http://127.0.0.1:8000/ajouter_antecedant_api'; // Base API URL from Django


  constructor(private http: HttpClient, private dossierPatientService: DossierPatientService,private shareddpiservice: ShareddpiService) { }

 
  addantecedent(newAntecedent: {
    titre: string, is_chirugical: boolean, description: string,
    id: number,
    dpi_id: number

   }): Observable<any> {
     console.log(newAntecedent)
     return this.http.post<any>(this.apiUrl, newAntecedent, { withCredentials: true });
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
