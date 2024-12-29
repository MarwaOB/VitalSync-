import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Biologiste } from '../../shared/models/Users/Biologiste';

@Injectable({
  providedIn: 'root'
})
export class BiologisteService {
  private biologistes: Biologiste[] = [
    {
      id: '3',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'biologiste',
      nss: 123456789,
      dateDeNaissance: new Date('1980-05-20'),
      adresse: '123 Rue de Paris, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle1.pdf',
      hopital: '1',
      password: "333",
      image: ""
    },
    {
      id: '4',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'biologiste',
      nss: 987654321,
      dateDeNaissance: new Date('1975-11-10'),
      adresse: '45 Boulevard Saint-Germain, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle2.pdf',
      hopital: '2',
      password: "444",
      image: ""
    },
    {
      id: '5',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'biologiste',
      nss: 123456789,
      dateDeNaissance: new Date('1980-05-20'),
      adresse: '123 Rue de Paris, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle1.pdf',
      hopital: '1',
      password: "555",
      image: ""
    },
    {
      id: '6',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'biologiste',
      nss: 987654321,
      dateDeNaissance: new Date('1975-11-10'),
      adresse: '45 Boulevard Saint-Germain, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle2.pdf',
      hopital: '2',
      password: "666",
      image: ""
    }
  ];

  constructor() { }

  getAll(): Observable<Biologiste[]> {
    return of(this.biologistes);
  }
  getById(id: string): Observable<Biologiste | undefined> {
    const bio = this.biologistes.find((m) => m.id === id);
    return of(bio);
  }
  add(biologiste: Biologiste): Observable<Biologiste> {
    const newId = (this.biologistes.length + 1).toString(); // refaire la generation de id 
    const newBiologiste = { ...biologiste, id: newId };
    this.biologistes.push(newBiologiste);
    return of(newBiologiste);
  }

}
