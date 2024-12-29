import { User } from "./Usert";

export class Patient extends User {

    personAContacterTelephone: string[];
    dateDebutHospitalisation: Date;
    dateFinHospitalisation: Date;
    dpiNull: boolean;

    constructor(
        id: string,
        nom: string,
        prenom: string,
        role: "patient",
        nss: number,
        dateDeNaissance: Date,
        adresse: string,
        telephone: string,
        mutuelle: string,
        hopital: string,
        email: string,
        password: string,
        image: string,
        personAContacterTelephone: string[] = [],
        dateDebutHospitalisation: Date,
        dateFinHospitalisation: Date,
        dpiNull: boolean = true
    ) {
        super(id, nom, prenom, role, nss, dateDeNaissance, adresse, telephone, mutuelle, hopital, email, password, image);

        this.personAContacterTelephone = personAContacterTelephone;
        this.dateDebutHospitalisation = dateDebutHospitalisation;
        this.dateFinHospitalisation = dateFinHospitalisation;
        this.dpiNull = dpiNull;
    }


}