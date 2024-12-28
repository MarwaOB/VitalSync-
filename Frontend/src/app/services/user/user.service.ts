import { Injectable } from '@angular/core';
import { User } from './../../shared/models/Users/User';  // Assurez-vous d'importer la classe User
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
  
})
export class UserService {

   private apiUrl = 'http://127.0.0.1:8000/user/signin'; // Ensure this matches your backend endpoint
  
    constructor(private http: HttpClient) { }
  
    signIn(username: string, password: string): Observable<any> {
      const body = { username, password };
      return this.http.post(this.apiUrl, body);
    }




  /*private users: User[] = [
    // Admin Centrals
    {
      id: '1',
      nom: 'nom',
      prenom: 'prenom',
      email: "email1@gmail.com",
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
    // Admin Sys
    {
      id: '2',
      nom: 'nom',
      prenom: 'prenom',
      email: "email2@gmail.com",
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
    // Biologistes
    {
      id: '3',
      nom: 'nom',
      prenom: 'prenom',
      email: "email3@gmail.com",
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
      email: "email4@gmail.com",
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
      email: "email5@gmail.com",
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
      email: "email6@gmail.com",
      role: 'biologiste',
      nss: 987654321,
      dateDeNaissance: new Date('1975-11-10'),
      adresse: '45 Boulevard Saint-Germain, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle2.pdf',
      hopital: '2',
      password: "666",
      image: ""
    },
    // Infirmiers
    {
      id: '7',
      nom: 'nom',
      prenom: 'prenom',
      email: "email7@gmail.com",
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
      email: "email8@gmail.com",
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
      email: "email9@gmail.com",
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
      email: "email10@gmail.com",
      role: 'infirmier',
      nss: 987654321,
      dateDeNaissance: new Date('1975-11-10'),
      adresse: '45 Boulevard Saint-Germain, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle2.pdf',
      hopital: '2',
      password: "101010",
      image: ""
    },
    // Laborantins
    {
      id: '11',
      nom: 'nom',
      prenom: 'prenom',
      email: "email11@gmail.com",
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
      email: "email12@gmail.com",
      role: 'laborantin',
      nss: 987654321,
      dateDeNaissance: new Date('1975-11-10'),
      adresse: '45 Boulevard Saint-Germain, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle2.pdf',
      hopital: '2',
      password: "121212",
      image: ""
    },
    // Médecins
    {
      id: '13',
      email: 'email13@gmail.com',
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
      email: 'email14@gmail.com',
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
      email: 'email15@gmail.com',
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
      email: 'email16@gmail.com',
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
    },
    // Patients
    {
      id: '17',
      nom: 'nom',
      prenom: 'prenom',
      email: "email17@gmail.com",
      role: 'patient',
      nss: 123456789,
      dateDeNaissance: new Date('1990-04-25'),
      adresse: '10 Rue des Lilas, Lyon',
      telephone: '0123456789',
      mutuelle: 'mutuelle_patient1.pdf',
      hopital: '1',
      password: "171717",
      image: "",
    },
    {
      id: '18',
      nom: 'nom',
      prenom: 'prenom',
      email: "email18@gmail.com",
      role: 'patient',
      nss: 987654321,
      dateDeNaissance: new Date('1985-08-15'),
      adresse: '15 Avenue des Champs-Élysées, Paris',
      telephone: '0654321987',
      mutuelle: 'mutuelle_patient2.pdf',
      hopital: '2',
      password: "181818",
      image: "",
    },
    {
      id: '19',
      nom: 'nom',
      prenom: 'prenom',
      email: "email19@gmail.com",
      role: 'patient',
      nss: 123456789,
      dateDeNaissance: new Date('1990-07-10'),
      adresse: '50 Rue de la République, Marseille',
      telephone: '0654321098',
      mutuelle: 'mutuelle_patient3.pdf',
      hopital: '1',
      password: "191919",
      image: "",
    },
    {
      id: '20',
      nom: 'nom',
      prenom: 'prenom',
      email: "email20@gmail.com",
      role: 'patient',
      nss: 987654321,
      dateDeNaissance: new Date('1995-09-30'),
      adresse: '32 Boulevard de la Liberté, Lyon',
      telephone: '0654321234',
      mutuelle: 'mutuelle_patient4.pdf',
      hopital: '2',
      password: "202020",
      image: "",
    },
    {
      id: '21',
      nom: 'nom',
      prenom: 'prenom',
      email: "email21@gmail.com",
      role: 'patient',
      nss: 123456789,
      dateDeNaissance: new Date('1992-02-14'),
      adresse: '85 Avenue des Acacias, Toulouse',
      telephone: '0612341234',
      mutuelle: 'mutuelle_patient5.pdf',
      hopital: '1',
      password: "212121",
      image: "",
    },
    {
      id: '22',
      nom: 'nom',
      prenom: 'prenom',
      email: "email22@gmail.com",
      role: 'patient',
      nss: 987654321,
      dateDeNaissance: new Date('1993-11-05'),
      adresse: '95 Rue des Écoles, Paris',
      telephone: '0609876543',
      mutuelle: 'mutuelle_patient6.pdf',
      hopital: '2',
      password: "222222",
      image: "",
    },
    {
      id: '23',
      nom: 'nom',
      prenom: 'prenom',
      email: "email23@gmail.com",
      role: 'patient',
      nss: 123456789,
      dateDeNaissance: new Date('1998-01-01'),
      adresse: '10 Rue du Général Leclerc, Lille',
      telephone: '0600000000',
      mutuelle: 'mutuelle_patient7.pdf',
      hopital: '1',
      password: "232323",
      image: "",
    }
  ];;
  private currentUser: User | null = null;


  setUsers(): void { }

  getUser(): User | null {
    return this.currentUser;
  }

  authenticate(email: string, password: string): User | null {
    const user = this.users.find(u => u.email === email && u.password === password);
    console.log(email);
    console.log(password);
    console.log(user);
    if (user) {
      this.currentUser = user;
      return user;
    }
    return null;
  }*/

}
