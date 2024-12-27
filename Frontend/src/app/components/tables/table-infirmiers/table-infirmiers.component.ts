import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Infirmier } from '../../../shared/models/Users/Infermier';
import { InfirmierService } from '../../../services/infirmier/infirmier.service';

@Component({
  selector: 'app-table-infirmiers',
  imports: [CommonModule],
  templateUrl: './table-infirmiers.component.html',
  styleUrl: './table-infirmiers.component.css'
})
export class TableInfirmiersComponent {
  infirmiers: Infirmier[] = [];
  constructor(private infirmierService: InfirmierService, private router: Router) { }

  ngOnInit(): void {
    this.infirmierService.getAll().subscribe((meds: Infirmier[]) => {
      this.infirmiers = meds;
    });
  }

  editinfirmier(infirmierId: string): void {
    this.router.navigate(['/infirmier-edit', infirmierId]);
    console.log('Édition du infirmier avec ID:', infirmierId);
  }

  deleteinfirmier(id: string): void {
    console.log('Suppression du infirmier avec ID:', id);
  }
}

