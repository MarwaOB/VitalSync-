import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RadiologueService } from '../../../services/radiologue/radiologue.service';
import { Radiologue } from '../../../shared/models/Users/Radiologue';

@Component({
  selector: 'app-table-radiologues',
  imports: [CommonModule],
  templateUrl: './table-radiologues.component.html',
  styleUrl: './table-radiologues.component.css'
})
export class TableRadiologuesComponent {
  radiologues: Radiologue[] = [];
  constructor(private radiologueService: RadiologueService, private router: Router) { }

  ngOnInit(): void {
    this.radiologueService.getAll().subscribe((meds: Radiologue[]) => {
      this.radiologues = meds;
    });
  }

  editradiologue(radiologueId: string): void {
    this.router.navigate(['/radiologue-edit', radiologueId]);
    console.log('Édition du radiologue avec ID:', radiologueId);
  }

  deleteradiologue(id: string): void {
    console.log('Suppression du radiologue avec ID:', id);
  }
}
