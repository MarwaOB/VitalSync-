import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminCentral } from '../../shared/models/Users/AdminCentral';

@Injectable({
  providedIn: 'root'
})
export class AdminCentralService {
  private adminCentrals: AdminCentral[] = [
    {
      id: '1',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'adminCentral',
      nss: 123456789,
      dateDeNaissance: new Date('1980-05-20'),
      adresse: '123 Rue de Paris, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle1.pdf',
      hopital: '1',
      password: "111",
      image: ""
    },
    {
      id: '1',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'adminCentral',
      nss: 123456789,
      dateDeNaissance: new Date('1980-05-20'),
      adresse: '123 Rue de Paris, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle1.pdf',
      hopital: '1',
      password: "111",
      image: ""
    },
  ];

  constructor() { }

  getAll(): Observable<AdminCentral[]> {
    return of(this.adminCentrals);
  }
  getById(id: string): Observable<AdminCentral | undefined> {
    const ad = this.adminCentrals.find((m) => m.id === id);
    return of(ad);
  }
  add(AdminCentral: AdminCentral): Observable<AdminCentral> {
    const newId = (this.adminCentrals.length + 1).toString(); // refaire la generation de id 
    const newAdminCentral = { ...AdminCentral, id: newId };
    this.adminCentrals.push(newAdminCentral);
    return of(newAdminCentral);
  }

}
