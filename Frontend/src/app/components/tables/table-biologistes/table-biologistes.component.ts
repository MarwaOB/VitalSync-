import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Biologiste } from '../../../shared/models/Users/Biologiste';
import { BiologisteService } from '../../../services/biologiste/biologiste.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-biologistes',
  imports: [CommonModule],
  templateUrl: './table-biologistes.component.html',
  styleUrl: './table-biologistes.component.css'
})
export class TableBiologistesComponent {
  biologistes: Biologiste[] = [];
  constructor(private biologisteService: BiologisteService, private router: Router) { }

  ngOnInit(): void {
    this.biologisteService.getAll().subscribe((bios: Biologiste[]) => {
      this.biologistes = bios;
    });
  }

  editbiologiste(biologisteId: string): void {
    this.router.navigate(['/biologiste-edit', biologisteId]);
    console.log('Édition du biologiste avec ID:', biologisteId);
  }

  deletebiologiste(id: string): void {
    console.log('Suppression du biologiste avec ID:', id);
  }
}
