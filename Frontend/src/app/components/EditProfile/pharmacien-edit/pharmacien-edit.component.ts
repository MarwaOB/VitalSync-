import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pharmacien } from '../../../shared/models/Users/Pharmacien';
import { PharmacienService } from '../../../services/pharmacien/pharmacien.service';
import { ProfileComponent } from "../../profile/profile.component";

@Component({
  selector: 'app-pharmacien-edit',
  imports: [ProfileComponent, CommonModule],
  templateUrl: './pharmacien-edit.component.html',
  styleUrls: ['./pharmacien-edit.component.css']
})
export class PharmacienEditComponent implements OnInit {
  pharmacienId?: string;
  pharmacienData?: Pharmacien;

  constructor(private route: ActivatedRoute, private pharmacienService: PharmacienService) { }

  ngOnInit(): void {
    this.pharmacienId = this.route.snapshot.paramMap.get('id')!;

    if (this.pharmacienId) {
      this.pharmacienService.getById(this.pharmacienId).subscribe((pharmacien) => {
        if (pharmacien) {
          this.pharmacienData = pharmacien;
        } else {
          console.error('Pharmacien non trouvé avec l\'ID:', this.pharmacienId);
        }
      });
    }
  }
}
