export class Diagnostic {
    id: string;
    ordonnanceId: string;

    constructor(ordonnanceId: string, id: string) {
        this.ordonnanceId = ordonnanceId;
        this.id = id;
    }
}
