import { Radiologue } from './../../../shared/models/Users/Radiologue';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RadiologueService } from '../../../services/radiologue/radiologue.service';


@Component({
  selector: 'app-table-radiologues',
  imports: [CommonModule],
  templateUrl: './table-radiologues.component.html',
  styleUrl: './table-radiologues.component.css'
})
export class TableRadiologuesComponent {
  radiologues: any[] = []; // Array to hold medecins data
   loading: boolean = false; // Loading indicator
   errorMessage: string | null = null; // Error message holder
 
   constructor(private radiologueService: RadiologueService) {}
 
   ngOnInit(): void {
    this.fetchMedecins();
  }

  /**
   * Fetch all medecins from the service.
   */
  fetchMedecins(): void {
    this.loading = true;
    this.errorMessage = null;

    this.radiologueService.getAll().subscribe({
      next: (response: { data: never[]; }) => {
        this.radiologues = response.data || [];
        this.loading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to fetch medecins. Please try again later.';
        this.loading = false;
        console.error('Error fetching medecins:', error);
      }
    });
  }


}
