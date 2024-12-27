import { MedecinService } from '../../../services/medecin/medecin.service';
import { Medecin } from '../../../shared/models/Users/Medecin';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-medecins',
  imports: [CommonModule],
  templateUrl: './table-medecins.component.html',
  styleUrl: './table-medecins.component.css'
})
export class TableMedecinsComponent {
  medecins: Medecin[] = [];
  constructor(private medecinService: MedecinService, private router: Router) { }

  ngOnInit(): void {
    this.medecinService.getAll().subscribe((meds: Medecin[]) => {
      this.medecins = meds;
    });
  }

  editMedecin(medecinId: string): void {
    this.router.navigate(['/medecin-edit', medecinId]);
    console.log('Édition du medecin avec ID:', medecinId);
  }

  deleteMedecin(id: string): void {
    console.log('Suppression du medecin avec ID:', id);
  }

}
