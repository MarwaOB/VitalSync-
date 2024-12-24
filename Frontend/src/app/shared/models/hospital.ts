export class Hospital {
    id: string;
    nom: string;
    lieu: string;
    dateCreation: Date;
    nombrePatients: number;
    nombrePersonnels: number;
    is_clinique: boolean;

    constructor(
        id: string,
        nom: string,
        lieu: string,
        dateCreation: Date,
        nombrePatients: number,
        nombrePersonnels: number,
        is_clinique: boolean
    ) {
        this.id = id;
        this.nom = nom;
        this.lieu = lieu;
        this.dateCreation = dateCreation;
        this.nombrePatients = nombrePatients;
        this.nombrePersonnels = nombrePersonnels;
        this.is_clinique = is_clinique;
    }
}
