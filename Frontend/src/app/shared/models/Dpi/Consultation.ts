export class Consultation {
    id: string;
    date: Date;
    dpiId: string;
    resume: string;
    diagnosticId: string;
    bilanBiologiqueId: string;
    bilanRadiologiqueId: string;


    constructor(
        dpiId: string,
        resume: string,
        diagnosticId: string,
        bilanBiologiqueId: string,
        bilanRadiologiqueId: string,
        date: Date,
        id: string
    ) {
        this.dpiId = dpiId;
        this.resume = resume;
        this.diagnosticId = diagnosticId;
        this.bilanBiologiqueId = bilanBiologiqueId;
        this.bilanRadiologiqueId = bilanRadiologiqueId;
        this.date = date;
        this.id = id;
    }
}
