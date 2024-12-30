import { User } from "./Usert";

export class AdminSys extends User {
    constructor(
        id: string,
        nom: string,
        prenom: string,
        role: "adminSys",
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
