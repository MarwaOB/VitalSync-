import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminSys } from '../../shared/models/Users/AdminSys';

@Injectable({
  providedIn: 'root'
})
export class AdminSysService {
  private adminSyss: AdminSys[] = [
    {
      id: '2',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'adminSys',
      nss: 123456789,
      dateDeNaissance: new Date('1980-05-20'),
      adresse: '123 Rue de Paris, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle1.pdf',
      hopital: '1',
      password: "222",
      image: ""
    },
    {
      id: '2',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'adminSys',
      nss: 123456789,
      dateDeNaissance: new Date('1980-05-20'),
      adresse: '123 Rue de Paris, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle1.pdf',
      hopital: '1',
      password: "222",
      image: ""
    },
  ];

  constructor() { }

  getAll(): Observable<AdminSys[]> {
    return of(this.adminSyss);
  }
  getById(id: string): Observable<AdminSys | undefined> {
    const ad = this.adminSyss.find((m) => m.id === id);
    return of(ad);
  }
  add(AdminSys: AdminSys): Observable<AdminSys> {
    const newId = (this.adminSyss.length + 1).toString(); // refaire la generation de id 
    const newAdminSys = { ...AdminSys, id: newId };
    this.adminSyss.push(newAdminSys);
    return of(newAdminSys);
  }

}
