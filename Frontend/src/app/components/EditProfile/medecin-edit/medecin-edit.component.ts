import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedecinService } from '../../../services/medecin/medecin.service';
import { ProfileComponent } from "../../profile/profile.component";
import { User } from '../../../shared/models/Users/User';


@Component({
  selector: 'app-medecin-edit',
  imports: [ProfileComponent, CommonModule],
  templateUrl: './medecin-edit.component.html',
  styleUrl: './medecin-edit.component.css'
})
export class MedecinEditComponent implements OnInit {
  medecinId?: string;
  medecinData?: User;

  constructor(private route: ActivatedRoute, private medecinService: MedecinService) { }

  ngOnInit(): void {
    this.medecinId = this.route.snapshot.paramMap.get('id')!;

    if (this.medecinId) {
      this.medecinService.getById(this.medecinId).subscribe((medecin) => {
        if (medecin) {
          this.medecinData = medecin;
        } else {
          console.error('Médecin non trouvé avec l\'ID:', this.medecinId);
        }
      });
    }
  }
}

