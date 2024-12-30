import { MedecinService } from '../../../services/medecin/medecin.service';
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
  medecins: any[] = []; // Array to hold medecins data
  loading: boolean = false; // Loading indicator
  errorMessage: string | null = null; // Error message holder

  constructor(private medecinService: MedecinService) {}

  ngOnInit(): void {
    this.fetchMedecins();
  }

  /**
   * Fetch all medecins from the service.
   */
  fetchMedecins(): void {
    this.loading = true;
    this.errorMessage = null;

    this.medecinService.getAll().subscribe({
      next: (response) => {
        this.medecins = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch medecins. Please try again later.';
        this.loading = false;
        console.error('Error fetching medecins:', error);
      }
    });
  }


}
