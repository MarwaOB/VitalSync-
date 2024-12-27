export class Bilan {
    id: string;
    bilanType: 'biologique' | 'radiologique';
    date?: Date;

    constructor(id: string, bilanType: 'biologique' | 'radiologique', date: Date) {
        this.id = id;
        this.bilanType = bilanType;
        this.date = date;
    }
}
