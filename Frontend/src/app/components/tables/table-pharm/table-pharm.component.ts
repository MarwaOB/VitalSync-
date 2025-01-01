import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PharmacienService } from '../../../services/pharmacien/pharmacien.service';
import { Pharmacien } from '../../../shared/models/Users/Pharmacien';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-pharm',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-pharm.component.html',
  styleUrl: './table-pharm.component.css'
})
export class TablePharmComponent {
  pharmaciens: Pharmacien[] = [];
  filteredPharmaciens: Pharmacien[] = [];
  searchId: string = '';
  searchNom: string = '';
  searchNss: string = '';
  searchDateNaissance: string = '';
  searchAdresse: string = '';
  searchTelephone: string = '';
  searchMutuelle: string = '';
  searchHopital: string = '';
  constructor(private pharmacienService: PharmacienService, private router: Router) { }

  profileData!: Pharmacien;
  editMode: boolean = false;
  openAddOverlay(): void {
    this.editMode = true;
    this.profileData = {
      id: '',
      nom: '',
      prenom: '',
      email: '',
      role: 'Pharmacien',
      nss: 0,
      dateDeNaissance: new Date(),
      adresse: '',
      telephone: '',
      mutuelle: '',
      hopital: '',
      password: '',
      image: ''
    };
  }
  addPharmacien(newPharmacien: Pharmacien): void { this.pharmacienService.add(newPharmacien); }

  saveChanges(): void {
    this.addPharmacien(this.profileData);
    this.editMode = false;
  }

  cancelEdit(): void {
    this.editMode = false;
  }
  ngOnInit(): void {
    this.pharmacienService.getAll().subscribe((pharmaciens: Pharmacien[]) => {
      this.pharmaciens = pharmaciens;
      this.filteredPharmaciens = pharmaciens;  // Initialisation avec tous les pharmaciens
    });
  }

  editpharmacien(pharmacienId: string): void {
    this.router.navigate(['/pharmacien-edit', pharmacienId]);
    console.log('Édition du pharmacien avec ID:', pharmacienId);
  }

  deletepharmacien(id: string): void {
    console.log('Suppression du pharmacien avec ID:', id);
  }

  filtrer(): void {
    this.filteredPharmaciens = this.pharmaciens.filter(pharmacien => {
      return (
        (this.searchId ? pharmacien.id.toString() === this.searchId.trim() : true) &&
        (this.searchNom ? pharmacien.nom.toLowerCase().trim() === this.searchNom.toLowerCase().trim() : true) &&
        (this.searchNss ? pharmacien.nss.toString() === this.searchNss.trim() : true) &&
        (this.searchDateNaissance ?
          pharmacien.dateDeNaissance.toISOString().slice(0, 10) === this.formatDate(this.searchDateNaissance.trim()) : true) &&        (this.searchAdresse ? pharmacien.adresse.toLowerCase().trim() === this.searchAdresse.toLowerCase().trim() : true) &&     (this.searchAdresse ? pharmacien.adresse.toLowerCase().trim() === this.searchAdresse.toLowerCase().trim() : true) &&
        (this.searchTelephone ? pharmacien.telephone === this.searchTelephone.trim() : true) &&
        (this.searchMutuelle ? pharmacien.mutuelle.toLowerCase().trim() === this.searchMutuelle.toLowerCase().trim() : true) &&
        (this.searchHopital ? pharmacien.hopital.toLowerCase().trim() === this.searchHopital.toLowerCase().trim() : true)
      );
    });
  }
  private formatDate(dateString: string): string {
    const [day, month, year] = dateString.split('/'); // Séparer la date en jour, mois, et année
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Reconstruire la date au format YYYY-MM-DD
  }
}
