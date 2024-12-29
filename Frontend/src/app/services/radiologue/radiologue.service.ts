import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Radiologue } from '../../shared/models/Users/Radiologue';

@Injectable({
  providedIn: 'root'
})
export class RadiologueService {
  private radiologues: Radiologue[] = [
    {
      id: '24',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      password: "242424",
      image: "",
      role: 'radiologue',
      nss: 123456789,
      dateDeNaissance: new Date('1980-05-20'),
      adresse: '123 Rue de Paris, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle1.pdf',
      hopital: '1'
    },
    {
      id: '25',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      password: "252525",
      image: "",
      role: 'radiologue',
      nss: 987654321,
      dateDeNaissance: new Date('1975-11-10'),
      adresse: '45 Boulevard Saint-Germain, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle2.pdf',
      hopital: '2'
    }
  ];

  constructor() { }

  getAll(): Observable<Radiologue[]> {
    return of(this.radiologues);
  }
  getById(id: string): Observable<Radiologue | undefined> {
    const rad = this.radiologues.find((m) => m.id === id);
    return of(rad);
  }
  add(Radiologue: Radiologue): Observable<Radiologue> {
    const newId = (this.radiologues.length + 1).toString(); // refaire la generation de id 
    const newRadiologue = { ...Radiologue, id: newId };
    this.radiologues.push(newRadiologue);
    return of(newRadiologue);
  }
}
