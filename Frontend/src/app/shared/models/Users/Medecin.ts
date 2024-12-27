import { User } from "./User";

export class Medecin extends User {
    constructor(
        id: string,
        nom: string,
        prenom: string,
        role: "medecin",
        nss: number,
        dateDeNaissance: Date,
        adresse: string,
        telephone: string,
        mutuelle: string,
        hopital: string,
        email: string,
        password: string,
        image: string
    ) {
        super(id, nom, prenom, role, nss, dateDeNaissance, adresse, telephone, mutuelle, hopital, email, password, image);
    }

}
