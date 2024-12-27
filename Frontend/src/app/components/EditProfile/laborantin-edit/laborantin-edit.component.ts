import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Laborantin } from '../../../shared/models/Users/Laborantin';
import { LaborantinService } from '../../../services/laborantin/laborantin.service';
import { ProfileComponent } from "../../profile/profile.component";

@Component({
  selector: 'app-laborantin-edit',
  imports: [ProfileComponent, CommonModule],
  templateUrl: './laborantin-edit.component.html',
  styleUrls: ['./laborantin-edit.component.css']
})
export class LaborantinEditComponent implements OnInit {
  laborantinId?: string;
  laborantinData?: Laborantin;

  constructor(private route: ActivatedRoute, private laborantinService: LaborantinService) { }

  ngOnInit(): void {
    this.laborantinId = this.route.snapshot.paramMap.get('id')!;

    if (this.laborantinId) {
      this.laborantinService.getById(this.laborantinId).subscribe((laborantin) => {
        if (laborantin) {
          this.laborantinData = laborantin;
        } else {
          console.error('Laborantin non trouvé avec l\'ID:', this.laborantinId);
        }
      });
    }
  }
}
