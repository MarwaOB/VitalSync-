
// src/app/models/user.model.ts
export class User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    NSS: string;
    date_de_naissance: string; // ISO 8601 format (YYYY-MM-DD)
    adresse: string;
    telephone: string;
    mutuelle: string;
    hospital: string;
  
    constructor(
      id: number,
      username: string,
      first_name: string,
      last_name: string,
      email: string,
      role: string,
      NSS: string,
      date_de_naissance: string,
      adresse: string,
      telephone: string,
      mutuelle: string,
      hospital: string
    ) {
      this.id = id;
      this.username = username;
      this.first_name = first_name;
      this.last_name = last_name;
      this.email = email;
      this.role = role;
      this.NSS = NSS;
      this.date_de_naissance = date_de_naissance;
      this.adresse = adresse;
      this.telephone = telephone;
      this.mutuelle = mutuelle;
      this.hospital = hospital;
    }
  
    // Example method: Get full name
    getFullName(): string {
      return `${this.first_name} ${this.last_name}`;
    }
  
    // Example method: Format birthdate to a more readable format (e.g., MM/DD/YYYY)
    getFormattedBirthDate(): string {
      const date = new Date(this.date_de_naissance);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
  }
  