export class Medicament {
    id: string;
    nom: string;
    duree: string;
    dose: number;
    dosePrise: number;
    dosePrevues: number;
    ordonnanceId: string;

    constructor(
        nom: string,
        duree: string,
        ordonnanceId: string,
        dose: number,
        dosePrise: number,
        dosePrevues: number,
        id: string
    ) {
        this.nom = nom;
        this.duree = duree;
        this.ordonnanceId = ordonnanceId;
        this.dose = dose;
        this.dosePrise = dosePrise;
        this.dosePrevues = dosePrevues;
        this.id = id;
    }
}
