import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareddpiService {
  private dpiSubject = new BehaviorSubject<{ dpi_id: number, patient_id: number, antecedents: any[], consultations: any[] } | null>(null);

  constructor() {
    // Load DPI data from localStorage when the service is initialized
    const storedDpiData = localStorage.getItem('dpiData');
    if (storedDpiData) {
      this.dpiSubject.next(JSON.parse(storedDpiData));
    }
  }

  // Set all DPI data at once and save to localStorage
  setDpiData(dpi_id: number, patient_id: number, antecedents: any[], consultations: any[]) {
    const newData = { dpi_id, patient_id, antecedents, consultations };
    this.dpiSubject.next(newData);
    localStorage.setItem('dpiData', JSON.stringify(newData));  // Save to localStorage
  }

  // Get all DPI data at once
  getDpiData(): Observable<{ dpi_id: number, patient_id: number, antecedents: any[], consultations: any[] } | null> {
    return this.dpiSubject.asObservable();
  }

  // Set dpi_id alone and save to localStorage
  setDpiId(dpi_id: number) {
    const currentData = this.dpiSubject.value;
    const newData = currentData ? { ...currentData, dpi_id } : { dpi_id, patient_id: 0, antecedents: [], consultations: [] };
    this.dpiSubject.next(newData);
    localStorage.setItem('dpiData', JSON.stringify(newData));  // Save to localStorage
  }

  // Get dpi_id alone
  getDpiId(): Observable<number | null> {
    return this.dpiSubject.asObservable().pipe(
      map(data => data ? data.dpi_id : null)
    );
  }

  // Set patient_id alone and save to localStorage
  setPatientId(patient_id: number) {
    const currentData = this.dpiSubject.value;
    const newData = currentData ? { ...currentData, patient_id } : { dpi_id: 0, patient_id, antecedents: [], consultations: [] };
    this.dpiSubject.next(newData);
    localStorage.setItem('dpiData', JSON.stringify(newData));  // Save to localStorage
  }

  // Get patient_id alone
  getPatientId(): Observable<number | null> {
    return this.dpiSubject.asObservable().pipe(
      map(data => data ? data.patient_id : null)
    );
  }

  // Set antecedents alone and save to localStorage
  setDpiPatientAntecedents(dpi_id: number, patient_id: number, antecedents: any[]) {
    const currentData = this.dpiSubject.value;
    const newData = currentData ? { ...currentData, dpi_id, patient_id, antecedents } : { dpi_id, patient_id, antecedents, consultations: [] };
    this.dpiSubject.next(newData);
    localStorage.setItem('dpiData', JSON.stringify(newData));  // Save to localStorage
  }

  // Set antecedents alone and save to localStorage
  setAntecedents(antecedents: any[]) {
    const currentData = this.dpiSubject.value;
    const newData = currentData ? { ...currentData, antecedents } : { dpi_id: 0, patient_id: 0, antecedents, consultations: [] };
    this.dpiSubject.next(newData);
    localStorage.setItem('dpiData', JSON.stringify(newData));  // Save to localStorage
  }

  // Get antecedents alone
  getAntecedents(): Observable<any[] | null> {
    return this.dpiSubject.asObservable().pipe(
      map(data => data ? data.antecedents : null)
    );
  }

  // Set consultations alone and save to localStorage
  setConsultations(consultations: any[]) {
    const currentData = this.dpiSubject.value;
    const newData = currentData ? { ...currentData, consultations } : { dpi_id: 0, patient_id: 0, antecedents: [], consultations };
    this.dpiSubject.next(newData);
    localStorage.setItem('dpiData', JSON.stringify(newData));  // Save to localStorage
  }

  // Get consultations alone
  getConsultations(): Observable<any[] | null> {
    return this.dpiSubject.asObservable().pipe(
      map(data => data ? data.consultations : null)
    );
  }
}
