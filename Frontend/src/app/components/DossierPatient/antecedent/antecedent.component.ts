import { Component } from '@angular/core';
import { AntecedentService } from '../../../services/DossierPatient/Antecedent/antecedent.service';
import { Antecedent } from '../../../shared/models/Dpi/Antecedent';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { ShareddpiService } from '../../../services/shareddpi/shareddpi.service';

@Component({
  selector: 'app-antecedent',
  imports: [CommonModule, FormsModule],
  templateUrl: './antecedent.component.html',
  styleUrl: './antecedent.component.css'
})
export class AntecedentComponent implements OnInit 
{
  antecedents: any[] = [];
  editMode: boolean = false;
  showDetails: boolean = false;
  selectedAntecedent: Antecedent | null = null;
  user: any = null;
  dpi : any= null ;

  tempAntecedant: any = 
  {
    titre: '', is_chirugical: false, description: '',
    id: 0,
    dpi_id: 0
  };
  
  constructor(private antecedentService: AntecedentService ,private userservice: UserService ,  private shareddpiService:ShareddpiService , private userService :UserService) { }
  ngOnInit(): void {
    this.user = this.userservice.getUserFromLocalStorage;
    this.shareddpiService.getAntecedents().subscribe({
      next: (antecedents) => {
        this.antecedents = antecedents || [];  // Assign the value to antecedents or an empty array
        console.log('Antecedents:', this.antecedents);
      },
      error: (err) => {
        console.error('Error fetching antecedents:', err);
      }
    });

   // this.antecedents = this.antecedentService.getAntecedents();
  }
  saveChanges(): void {
    if (this.tempAntecedant.id) 
      {
      const success = this.antecedentService.updateAntecedent(this.tempAntecedant);
      if (success) {
        console.log('Antécédent mis à jour avec succès');
      } else {
        console.log('Échec de la mise à jour');
      }
     } else {
      const success = this.antecedentService.addantecedent(this.tempAntecedant);
      if (success) {
        console.log('Antécédent ajouté avec succès');
      } else {
        console.log('Échec de l\'ajout');
      }
    }
    this.editMode = false;
    this.antecedents = this.antecedentService.getAntecedents(); // Recharger la liste après modification ou ajout

  }
  cancelEdit(): void {
    this.editMode = false;
  }
  modifier(antecedentId: string): void {
    const antecedent = this.antecedents.find(a => a.id === antecedentId);
    if (antecedent) {
      this.tempAntecedant = { ...antecedent };
      this.editMode = true;
    }
  }
  // supprimer(antecedentId: string): void {
  //   const success = this.antecedentService.removeAntecedent(antecedentId);
  //   if (success) {
  //     console.log('Antécédent supprimé avec succès');
  //     this.antecedents = this.antecedentService.getAntecedents(); // Recharger la liste après suppression
  //   } else {
  //     console.log('Échec de la suppression');
  //   }
  // }
  
  saveChanges1(): void {

    this.shareddpiService.getDpiId().subscribe((dpiId) => {
      if (dpiId !== null) {
        this.tempAntecedant.dpi_id = dpiId; // Assign the retrieved dpiId
        console.log('Sending data:', this.tempAntecedant); // Log the data being sent
  
        // Send the antecedent data to the backend
        this.antecedentService.addantecedent(this.tempAntecedant).subscribe({
          next: (response: any) => {
            console.log('Antecedent added successfully', response);
          },
          error: (error: any) => {
            console.error('Error adding antecedent:', error);
            if (error.error) {
              console.error('Server Response:', error.error);
            }
          }
        });
  
        // Exit edit mode
        this.editMode = false;
      } else {
        console.error('DPI ID is null. Cannot proceed.');
      }
    });
  }
  
  ajouterAntecedent(): void {
    this.tempAntecedant = { titre: '', is_chirugical: false, description: '', id: 0, dpi_id: 0 };
    this.editMode = true;
  }
  voirPlus(antecedent: any): void {
    this.selectedAntecedent = antecedent;
    this.showDetails = true;
  }
  getShortDescription(description: string): string {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  }
  cancelShowDetails(): void {
    this.showDetails = false;
    this.selectedAntecedent = null;
  }
}
