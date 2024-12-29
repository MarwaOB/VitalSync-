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
 infermiers: any[] = []; // Array to hold medecins data
   loading: boolean = false; // Loading indicator
   errorMessage: string | null = null; // Error message holder
 
   constructor(private infermierService: InfirmierService) {}
 
   ngOnInit(): void {
     this.fetchMedecins();
   }
 
   /**
    * Fetch all medecins from the service.
    */
   fetchMedecins(): void {
     this.loading = true;
     this.errorMessage = null;
 
     this.infermierService.getAll().subscribe({
       next: (response: { data: never[]; }) => {
         this.infermiers = response.data || [];
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

