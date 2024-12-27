import { Injectable } from '@angular/core';
import { Medecin } from '../../shared/models/Users/Medecin';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  private medecins: Medecin[] = [
    {
      id: '13',
      email: 'email@gmail.com',
      nom: 'nom',
      prenom: 'prenom',
      role: 'medecin',
      nss: 123456789,
      dateDeNaissance: new Date('1980-05-20'),
      adresse: '123 Rue de Paris, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle1.pdf',
      hopital: '1',
      password: "131313",
      image: ""
    },
    {
      id: '14',
      email: 'email@gmail.com',
      nom: 'nom',
      prenom: 'prenom',
      role: 'medecin',
      nss: 987654321,
      dateDeNaissance: new Date('1975-11-10'),
      adresse: '45 Boulevard Saint-Germain, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle2.pdf',
      hopital: '2',
      password: "141414",
      image: ""
    },
    {
      id: '15',
      email: 'email@gmail.com',
      nom: 'nom',
      prenom: 'prenom',
      role: 'medecin',
      nss: 123456789,
      dateDeNaissance: new Date('1980-05-20'),
      adresse: '123 Rue de Paris, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle1.pdf',
      hopital: '1',
      password: "151515",
      image: ""
    },
    {
      id: '16',
      email: 'email@gmail.com',
      nom: 'nom',
      prenom: 'prenom',
      role: 'medecin',
      nss: 987654321,
      dateDeNaissance: new Date('1975-11-10'),
      adresse: '45 Boulevard Saint-Germain, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle2.pdf',
      hopital: '2',
      password: "161616",
      image: ""
    }
  ];

  constructor() { }

  getAll(): Observable<Medecin[]> {
    return of(this.medecins);
  }
  getById(id: string): Observable<Medecin | undefined> {
    const medecin = this.medecins.find((m) => m.id === id);
    return of(medecin);
  }
}