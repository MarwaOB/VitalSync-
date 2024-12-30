import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../shared/models/Users/User';
import { InfirmierService } from '../../../services/infirmier/infirmier.service';
import { ProfileComponent } from "../../profile/profile.component";

@Component({
  selector: 'app-infirmier-edit',
  imports: [ProfileComponent, CommonModule],
  templateUrl: './infirmier-edit.component.html',
  styleUrls: ['./infirmier-edit.component.css']
})
export class InfirmierEditComponent implements OnInit {
  infirmierId?: string;
  infirmierData?: User;

  constructor(private route: ActivatedRoute, private infirmierService: InfirmierService) { }

  ngOnInit(): void {
    this.infirmierId = this.route.snapshot.paramMap.get('id')!;

    if (this.infirmierId) {
      this.infirmierService.getById(this.infirmierId).subscribe((infirmier) => {
        if (infirmier) {
          this.infirmierData = infirmier;
        } else {
          console.error('Infirmier non trouvé avec l\'ID:', this.infirmierId);
        }
      });
    }
  }
}
