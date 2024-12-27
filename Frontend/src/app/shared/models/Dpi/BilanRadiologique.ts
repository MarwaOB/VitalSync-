import { Bilan } from "./Bilan";

export class Radiologique extends Bilan {
    radiologueId: string;

    constructor(id: string, bilanType: 'biologique' | 'radiologique', date: Date, radiologueId: string) {
        super(id, bilanType, date);
        this.radiologueId = radiologueId;
    }
}