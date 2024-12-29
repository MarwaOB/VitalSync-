
  // src/app/models/patient.model.ts
import { User } from './User';

export class Patient {
  id: number;
  user: User; // Nested user object
  person_a_contacter_telephone: string;
  date_debut_hospitalisation: string; // ISO 8601 date string format
  date_fin_hospitalisation: string | null; // Nullable field
  dpi_null: boolean;

  constructor(
    id: number,
    user: User,
    person_a_contacter_telephone: string,
    date_debut_hospitalisation: string,
    date_fin_hospitalisation: string | null,
    dpi_null: boolean
  ) {
    this.id = id;
    this.user = user;
    this.person_a_contacter_telephone = person_a_contacter_telephone;
    this.date_debut_hospitalisation = date_debut_hospitalisation;
    this.date_fin_hospitalisation = date_fin_hospitalisation;
    this.dpi_null = dpi_null;
  }

  // Example method: Check if the patient is currently hospitalized
  isCurrentlyHospitalized(): boolean {
    const currentDate = new Date();
    const startDate = new Date(this.date_debut_hospitalisation);
    const endDate = this.date_fin_hospitalisation
      ? new Date(this.date_fin_hospitalisation)
      : null;

    return currentDate >= startDate && (!endDate || currentDate <= endDate);
  }

  // Example method: Format the hospitalization period
  getHospitalizationPeriod(): string {
    const startDate = new Date(this.date_debut_hospitalisation).toLocaleDateString();
    const endDate = this.date_fin_hospitalisation
      ? new Date(this.date_fin_hospitalisation).toLocaleDateString()
      : 'Present';

    return `${startDate} - ${endDate}`;
  }
}
