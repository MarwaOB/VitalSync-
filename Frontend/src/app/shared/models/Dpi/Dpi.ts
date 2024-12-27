export class Dpi {
    id: string;
    QR_Code: string;
    patientId: string | null;
    medecinId: string | null;

    constructor(id: string, QR_Code: string, patientId: string | null, medecinId: string | null) {
        this.id = id;
        this.QR_Code = QR_Code;
        this.patientId = patientId;
        this.medecinId = medecinId;
    }
}
