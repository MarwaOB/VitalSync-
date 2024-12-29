export interface CustomUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    NSS: number;
    role: string;
    date_de_naissance?: string; // Optional
    adresse: string;
    telephone: string;
    mutuelle?: string; // URL for the uploaded file
    hospital?: number | null; // ID of the hospital
  }