import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../shared/models/Users/User';
import { LaborantinService } from '../../../services/laborantin/laborantin.service';

@Component({
  selector: 'app-table-laborantins',
  imports: [CommonModule],
  templateUrl: './table-laborantins.component.html',
  styleUrl: './table-laborantins.component.css'
})
export class TableLaborantinsComponent {
  laborantins: any[] = []; // Array to hold medecins data
     loading: boolean = false; // Loading indicator
     errorMessage: string | null = null; // Error message holder
   
     constructor(private laboratinService: LaborantinService) {}
   
     ngOnInit(): void {
       this.fetchMedecins();
     }
   
     /**
      * Fetch all medecins from the service.
      */
     fetchMedecins(): void {
       this.loading = true;
       this.errorMessage = null;
   
       this.laboratinService.getAll().subscribe({
         next: (response: { data: never[]; }) => {
           this.laborantins = response.data || [];
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
