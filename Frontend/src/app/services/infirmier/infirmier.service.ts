import { Injectable } from '@angular/core';
import { Infirmier } from '../../shared/models/Users/Infermier';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfirmierService {

  private infirmiers: Infirmier[] = [
    {
      id: '7',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'infirmier',
      nss: 123456789,
      dateDeNaissance: new Date('1980-05-20'),
      adresse: '123 Rue de Paris, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle1.pdf',
      hopital: '1',
      password: "777",
      image: ""
    },
    {
      id: '8',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'infirmier',
      nss: 987654321,
      dateDeNaissance: new Date('1975-11-10'),
      adresse: '45 Boulevard Saint-Germain, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle2.pdf',
      hopital: '2',
      password: "888",
      image: ""
    },
    {
      id: '9',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'infirmier',
      nss: 123456789,
      dateDeNaissance: new Date('1980-05-20'),
      adresse: '123 Rue de Paris, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle1.pdf',
      hopital: '1',
      password: "999",
      image: ""
    },
    {
      id: '10',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'infirmier',
      nss: 987654321,
      dateDeNaissance: new Date('1975-11-10'),
      adresse: '45 Boulevard Saint-Germain, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle2.pdf',
      hopital: '2',
      password: "101010",
      image: ""
    }
  ];

  constructor() { }

  getAll(): Observable<Infirmier[]> {
    return of(this.infirmiers);
  }
  getById(id: string): Observable<Infirmier | undefined> {
    const inf = this.infirmiers.find((m) => m.id === id);
    return of(inf);
  }
  add(Infirmier: Infirmier): Observable<Infirmier> {
    const newId = (this.infirmiers.length + 1).toString();
    const newInfirmier = { ...Infirmier, id: newId };
    this.infirmiers.push(newInfirmier);
    return of(newInfirmier);
  }
}