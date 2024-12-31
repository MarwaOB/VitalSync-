export class Dpi {
    id: string;
    QR_Code: string;
    patientId: number | null;
    medecinId: number | null;

    constructor(id: string, QR_Code: string, patientId: number | null, medecinId: number | null) {
        this.id = id;
        this.QR_Code = QR_Code;
        this.patientId = patientId;
        this.medecinId = medecinId;
    }
}

