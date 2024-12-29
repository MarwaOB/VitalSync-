import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Laborantin } from '../../shared/models/Users/Laborantin';

@Injectable({
  providedIn: 'root'
})
export class LaborantinService {

  private laborantins: Laborantin[] = [
    {
      id: '11',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'laborantin',
      nss: 123456789,
      dateDeNaissance: new Date('1980-05-20'),
      adresse: '123 Rue de Paris, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle1.pdf',
      hopital: '1',
      password: "111111",
      image: ""
    },
    {
      id: '12',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'laborantin',
      nss: 987654321,
      dateDeNaissance: new Date('1975-11-10'),
      adresse: '45 Boulevard Saint-Germain, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle2.pdf',
      hopital: '2',
      password: "121212",
      image: ""
    }
  ];

  constructor() { }

  getAll(): Observable<Laborantin[]> {
    return of(this.laborantins);
  }
  getById(id: string): Observable<Laborantin | undefined> {
    const labo = this.laborantins.find((m) => m.id === id);
    return of(labo);
  }
  add(Laborantin: Laborantin): Observable<Laborantin> {
    const newId = (this.laborantins.length + 1).toString(); // refaire la generation de id 
    const newLaborantin = { ...Laborantin, id: newId };
    this.laborantins.push(newLaborantin);
    return of(newLaborantin);
  }
}
