import { Patient } from './../../shared/models/Users/Patient';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patients: Patient[] = [
    {
      id: '17',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'patient',
      nss: 123456789,
      dateDeNaissance: new Date('1990-04-25'),
      adresse: '10 Rue des Lilas, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle_patient1.pdf',
      hopital: '1',
      password: "171717",
      image: "",
      personAContacterTelephone: ['0612345678', '0709876543'],
      dateDebutHospitalisation: new Date('2024-12-01'),
      dateFinHospitalisation: new Date('2024-12-10'),
      dpiNull: false
    },
    {
      id: '18',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'patient',
      nss: 987654321,
      dateDeNaissance: new Date('1985-08-15'),
      adresse: '15 Avenue des Champs-Élysées, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle_patient2.pdf',
      hopital: '2',
      password: "181818",
      image: "",
      personAContacterTelephone: ['0698765432'],
      dateDebutHospitalisation: new Date('2024-11-20'),
      dateFinHospitalisation: new Date('2024-11-25'),
      dpiNull: true
    },
    {
      id: '19',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'patient',
      nss: 123456789,
      dateDeNaissance: new Date('1990-04-25'),
      adresse: '10 Rue des Lilas, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle_patient1.pdf',
      hopital: '1',
      password: "191919",
      image: "",
      personAContacterTelephone: ['0612345678', '0709876543'],
      dateDebutHospitalisation: new Date('2024-12-01'),
      dateFinHospitalisation: new Date('2024-12-10'),
      dpiNull: false
    },
    {
      id: '20',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'patient',
      nss: 987654321,
      dateDeNaissance: new Date('1985-08-15'),
      adresse: '15 Avenue des Champs-Élysées, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle_patient2.pdf',
      hopital: '2',
      password: "202020",
      image: "",
      personAContacterTelephone: ['0698765432'],
      dateDebutHospitalisation: new Date('2024-11-20'),
      dateFinHospitalisation: new Date('2024-11-25'),
      dpiNull: true
    }, {
      id: '21',
      nom: 'nom',
      prenom: 'prenom',
      email: "email",
      role: 'patient',
      nss: 123456789,
      dateDeNaissance: new Date('1990-04-25'),
      adresse: '10 Rue des Lilas, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle_patient1.pdf',
      hopital: '1',
      password: "212121",
      image: "",
      personAContacterTelephone: ['0612345678', '0709876543'],
      dateDebutHospitalisation: new Date('2024-12-01'),
      dateFinHospitalisation: new Date('2024-12-10'),
      dpiNull: false
    }
  ];

  constructor() { }

  getAll(): Observable<Patient[]> {
    return of(this.patients);
  }
  getById(id: string): Observable<Patient | undefined> {
    const patient = this.patients.find((m) => m.id === id);
    return of(patient);
  }
}
