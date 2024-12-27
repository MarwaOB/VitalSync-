import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Laborantin } from '../../../shared/models/Users/Laborantin';
import { LaborantinService } from '../../../services/laborantin/laborantin.service';

@Component({
  selector: 'app-table-laborantins',
  imports: [CommonModule],
  templateUrl: './table-laborantins.component.html',
  styleUrl: './table-laborantins.component.css'
})
export class TableLaborantinsComponent {
  laborantins: Laborantin[] = [];
  constructor(private laborantinService: LaborantinService, private router: Router) { }

  ngOnInit(): void {
    this.laborantinService.getAll().subscribe((meds: Laborantin[]) => {
      this.laborantins = meds;
    });
  }

  editlaborantin(laborantinId: string): void {
    this.router.navigate(['/laborantin-edit', laborantinId]);
    console.log('Édition du laborantin avec ID:', laborantinId);
  }

  deletelaborantin(id: string): void {
    console.log('Suppression du laborantin avec ID:', id);
  }
}
