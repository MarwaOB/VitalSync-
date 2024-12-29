import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../shared/models/Users/User';
import { RadiologueService } from '../../../services/radiologue/radiologue.service';
import { ProfileComponent } from "../../profile/profile.component";

@Component({
  selector: 'app-radiologue-edit',
  imports: [ProfileComponent, CommonModule],
  templateUrl: './radiologue-edit.component.html',
  styleUrls: ['./radiologue-edit.component.css']
})
export class RadiologueEditComponent implements OnInit {
  radiologueId?: string;
  radiologueData?: User;

  constructor(private route: ActivatedRoute, private radiologueService: RadiologueService) { }

  ngOnInit(): void {
    this.radiologueId = this.route.snapshot.paramMap.get('id')!;

    if (this.radiologueId) {
      this.radiologueService.getById(this.radiologueId).subscribe((radiologue) => {
        if (radiologue) {
          this.radiologueData = radiologue;
        } else {
          console.error('Radiologue non trouvé avec l\'ID:', this.radiologueId);
        }
      });
    }
  }
}
