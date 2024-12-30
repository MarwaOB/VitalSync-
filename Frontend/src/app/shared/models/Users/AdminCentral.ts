import { User } from "./Usert";

export class AdminCentral extends User {
    constructor(
        id: string,
        nom: string,
        prenom: string,
        role: "adminCentral",
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
