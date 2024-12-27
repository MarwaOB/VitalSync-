export class Antecedent {
    id: string;
    titre: string;
    description: string;
    isChirurgical: boolean;
    dpiId: string;

    constructor(
        id: string,
        titre: string,
        description: string,
        isChirurgical: boolean,
        dpiId: string
    ) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.isChirurgical = isChirurgical;
        this.dpiId = dpiId;
    }
}
