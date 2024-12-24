import { Injectable, OnInit } from '@angular/core';
import { Hospital } from '../../shared/models/hospital';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HospitalService {
  private hospitals: Hospital[] = [
    { id: '1', nom: 'Hôpital de Paris', lieu: 'Paris', dateCreation: new Date('2000-01-01'), nombrePatients: 200, nombrePersonnels: 50, is_clinique: false },
    { id: '2', nom: 'Clinique de Lyon', lieu: 'Lyon', dateCreation: new Date('2010-05-20'), nombrePatients: 120, nombrePersonnels: 30, is_clinique: true },
    { id: '3', nom: 'Hôpital de Marseille', lieu: 'Marseille', dateCreation: new Date('1998-07-15'), nombrePatients: 250, nombrePersonnels: 60, is_clinique: false },
  ];

  constructor() { }

  getAll(): Observable<Hospital[]> {
    return of(this.hospitals);  // Retourne un Observable avec les données statiques
  }

}
