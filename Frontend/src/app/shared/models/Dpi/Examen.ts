export class Examen {
    id: string;
    type: string;
    description: string;
    images: string;
    bilanRadiologiqueId: string;

    constructor(
        id: string,
        type: string,
        description: string,
        images: string,
        bilanRadiologiqueId: string
    ) {
        this.id = id;
        this.type = type;
        this.description = description;
        this.images = images;
        this.bilanRadiologiqueId = bilanRadiologiqueId;
    }
}
