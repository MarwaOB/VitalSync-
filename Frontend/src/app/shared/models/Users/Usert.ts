export class User {
    id: string;
    nom: string;
    prenom: string;
    role: string;
    nss: number;
    dateDeNaissance: Date;
    adresse: string;
    telephone: string;
    mutuelle: string;
    hopital: string;
    email: string;
    password: string;
    image: string;
    constructor(
        id: string,
        nom: string,
        prenom: string,
        role: string,
        nss: number,
        dateDeNaissance: Date,
        adresse: string,
        telephone: string,
        mutuelle: string,
        hopital: string,
        email: string,
        password: string,
        image: string

    ) {
        this.nom = nom;
        this.prenom = prenom;
        this.id = id;
        this.role = role;
        this.nss = nss;
        this.dateDeNaissance = dateDeNaissance;
        this.adresse = adresse;
        this.telephone = telephone;
        this.mutuelle = mutuelle;
        this.hopital = hopital;
        this.email = email;
        this.password = password;
        this.image = image;
    }

}


