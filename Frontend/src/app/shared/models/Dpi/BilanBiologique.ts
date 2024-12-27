import { Bilan } from "./Bilan";

export class Biologique extends Bilan {
    laborantinId: string;
    description: string;
    tauxGlycemie: number;
    tauxPressionArterielle: string;
    tauxCholesterol: number;

    constructor(
        id: string,
        bilanType: 'biologique' | 'radiologique',
        date: Date,
        laborantinId: string,
        description: string = '',
        tauxGlycemie: number,
        tauxPressionArterielle: string,
        tauxCholesterol: number
    ) {
        super(id, bilanType, date);
        this.laborantinId = laborantinId;
        this.description = description;
        this.tauxGlycemie = tauxGlycemie;
        this.tauxPressionArterielle = tauxPressionArterielle;
        this.tauxCholesterol = tauxCholesterol;
    }
}