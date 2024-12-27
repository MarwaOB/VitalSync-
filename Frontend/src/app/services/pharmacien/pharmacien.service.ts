import { Injectable } from '@angular/core';
import { Pharmacien } from '../../shared/models/Users/Pharmacien';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PharmacienService {
  private pharmaciens: Pharmacien[] = [
    {
      id: '22',
      nom: 'nom',
      prenom: 'prenom',
      role: 'pharmacien',
      email: "email",
      password: "222222",
      image: "",
      nss: 123456789,
      dateDeNaissance: new Date('1980-05-20'),
      adresse: '123 Rue de Paris, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle1.pdf',
      hopital: '1'
    },
    {
      id: '23',
      nom: 'nom',
      prenom: 'prenom',
      role: 'pharmacien',
      email: "email",
      password: "232323",
      image: "",
      nss: 987654321,
      dateDeNaissance: new Date('1975-11-10'),
      adresse: '45 Boulevard Saint-Germain, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle2.pdf',
      hopital: '2'
    }
  ];

  constructor() { }

  getAll(): Observable<Pharmacien[]> {
    return of(this.pharmaciens);
  }
  getById(id: string): Observable<Pharmacien | undefined> {
    const ph = this.pharmaciens.find((m) => m.id === id);
    return of(ph);
  }
}