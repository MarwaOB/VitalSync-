import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareddpiService {
  private dpiSubject = new BehaviorSubject<{ dpi_id: number, patient_id: number,antecedents:any[],consultations:any[] } | null>(null);

  constructor() { }

  setDpiData(dpi_id: number, patient_id: number ,antecedents : any[],consultations : any []) 
  {
    this.dpiSubject.next({ dpi_id, patient_id,antecedents ,consultations });
  }

  getDpiData(): Observable<{ dpi_id: number, patient_id: number } | null> {
    return this.dpiSubject.asObservable();
  }
}
