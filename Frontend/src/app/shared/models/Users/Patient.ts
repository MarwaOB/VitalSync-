import { CustomUser } from "./CustomUser";
import { User } from "./User";

// Interface for the Patient model
export interface Patient {
    id: number;
    user: CustomUser;
    person_a_contacter_telephone: string[]; // JSONField as an array of strings
    date_debut_hospitalisation: string[]; // JSONField as an array of ISO date strings
    date_fin_hospitalisation: string[]; // JSONField as an array of ISO date strings
    dpi_null: boolean;
  }
