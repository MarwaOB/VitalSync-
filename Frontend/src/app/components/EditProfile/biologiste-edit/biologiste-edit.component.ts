import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Biologiste } from '../../../shared/models/Users/Biologiste';
import { BiologisteService } from '../../../services/biologiste/biologiste.service';
import { ProfileComponent } from "../../profile/profile.component";

@Component({
  selector: 'app-biologiste-edit',
  imports: [ProfileComponent, CommonModule],
  templateUrl: './biologiste-edit.component.html',
  styleUrls: ['./biologiste-edit.component.css']
})
export class BiologisteEditComponent implements OnInit {
  biologisteId?: string;
  biologisteData?: Biologiste;
  tempProfileData: any;

  constructor(private route: ActivatedRoute, private biologisteService: BiologisteService) { }

  ngOnInit(): void {
    this.biologisteId = this.route.snapshot.paramMap.get('id')!;

    if (this.biologisteId) {
      this.biologisteService.getById(this.biologisteId).subscribe((biologiste) => {
        if (biologiste) {
          this.biologisteData = biologiste;
        } else {
          console.error('Biologiste non trouvé avec l\'ID:', this.biologisteId);
        }
      });
    }
  }
}
