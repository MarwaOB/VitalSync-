export class Ordonnance {
    id: string;
    diagnosticId: string;
    duree: string;
    isValid: boolean;

    constructor(diagnosticId: string, duree: string, isValid: boolean = false, id: string) {
        this.diagnosticId = diagnosticId;
        this.duree = duree;
        this.isValid = isValid;
        this.id = id;
    }
}
