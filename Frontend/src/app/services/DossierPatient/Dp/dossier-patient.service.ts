import { Injectable } from '@angular/core';
import { Antecedent } from '../../../shared/models/Dpi/Antecedent';
import { Patient } from '../../../shared/models/Users/Patient';
import { Medecin } from '../../../shared/models/Users/Medecin';
import { Dpi } from '../../../shared/models/Dpi/Dpi';
import { AntecedentService } from '../Antecedent/antecedent.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class DossierPatientService 
{
  constructor(private http: HttpClient, private userService: UserService) {}

  
  private patient: Patient | null = null;
  private medecin: Medecin | null = null;
  private dp: Dpi | null = null;
  private apiUr = 'http://127.0.0.1:8000/'; // Base API URL from Django

  private apiUrl = 'http://127.0.0.1:8000/show_dpi'; // Base API URL from Django
  private apiUrl1 = 'http://127.0.0.1:8000/CreerDpi'; // Base API URL from Django
  private apiUrl2 = 'http://127.0.0.1:8000/show_antecedant'; // Base API URL from Django
  private apiUrl3 = 'http://127.0.0.1:8000/show_consultations'; // Base API URL from Django

  getAll(): Observable<any> {
    const userRole = this.userService.user?.role; // Access the user's role
    const userId = this.userService.user?.id; // Access the user's id
    const urlWithParams = `${this.apiUrl}?role=${userRole}&id=${userId}`; // Append both role and id as query parameters
    
    return this.http.get<any>(urlWithParams, { withCredentials: true }); // Make the request with the modified URL
  }

  addDpi(newDpi: {
    medecin_id :number ;
    patient_id :number ;

   }): Observable<any> {
     console.log(newDpi)
     return this.http.post<any>(this.apiUrl1, newDpi, { withCredentials: true });
   }
   getAntecedentsByPatientId(patient_id: number): Observable<any> {
    const url = `${this.apiUrl2}/${patient_id}`;  // Concatenate the patientId to the base URL
    return this.http.get<any>(url, { withCredentials: true });
  }
  
  getConsultationsByPatientId(patient_id: number): Observable<any> {
    const url = `${this.apiUrl3}/${patient_id}`;  // Concatenate the patientId to the base URL
    return this.http.get<any>(url, { withCredentials: true });
  }
   
  filterByImage(qrCodePath: string | null): Observable<any> {
    console.log('Constructed API URL 1:', qrCodePath);

    if (!qrCodePath) {
      throw new Error('QR code path cannot be null or undefined.');
    }
  
    // Construct the API URL
    const mediaBaseUrl = 'http://127.0.0.1:8000/media';
    const qrCodeUrl = `${mediaBaseUrl}/${qrCodePath}`;
    console.log('Constructed API URL:', qrCodeUrl);

    const apiEndpoint = 'http://127.0.0.1:8000/recherche_dpi_qrcode_api/';

    const urlWithQrCode = `${apiEndpoint}?qr_code_url=${qrCodeUrl}`;
  
    console.log('Constructed API URL1222:', urlWithQrCode);
  
    // Make the HTTP GET request
    return this.http.get<any>(urlWithQrCode, { withCredentials: true });
  }
  filterBynss(filterBynss: number | null): Observable<any> {
    

    if (!filterBynss) {
      throw new Error('QR code path cannot be null or undefined.');
    }
  
    const url = `${this.apiUrl3}/${filterBynss}`; 
    // Construct the API URL
    const apiEndpoint = 'http://127.0.0.1:8000/recherche_nss_api';

    const filterBynsss = `${apiEndpoint}/${filterBynss}`;
    console.log('Constructed API URL:', filterBynsss);

  
    // Make the HTTP GET request
    return this.http.get<any>(filterBynsss, { withCredentials: true });
  }
  
  

   
  setPatient(patient: Patient): void 
  {
    this.patient = patient;
  }
  setMedecin(medecin: Medecin): void 
  {
    this.medecin = medecin;
  }

  setDpi(dpi: Dpi): void {
    this.dp = dpi;
  }
  getPatient(): Patient | null {
    return this.patient;
  }
  getMedecin(): Medecin | null {
    return this.medecin;
  }
  getDpi(): Dpi | null {
    return this.dp;
  }
}
