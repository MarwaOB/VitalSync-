import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PharmacienService } from '../../../services/pharmacien/pharmacien.service';
import { Pharmacien } from '../../../shared/models/Users/Pharmacien';

@Component({
  selector: 'app-table-pharm',
  imports: [CommonModule],
  templateUrl: './table-pharm.component.html',
  styleUrl: './table-pharm.component.css'
})
export class TablePharmComponent {
  pharmaciens: Pharmacien[] = [];
  constructor(private pharmacienService: PharmacienService, private router: Router) { }

  ngOnInit(): void {
    this.pharmacienService.getAll().subscribe((meds: Pharmacien[]) => {
      this.pharmaciens = meds;
    });
  }

  editpharmacien(pharmacienId: string): void {
    this.router.navigate(['/pharmacien-edit', pharmacienId]);
    console.log('Édition du pharmacien avec ID:', pharmacienId);
  }

  deletepharmacien(id: string): void {
    console.log('Suppression du pharmacien avec ID:', id);
  }
}
