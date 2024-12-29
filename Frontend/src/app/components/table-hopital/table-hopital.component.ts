import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Hospital } from '../../shared/models/hospital';
import { HospitalService } from '../../services/hospital/hospital.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-hopital',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-hopital.component.html',
  styleUrls: ['./table-hopital.component.css']
})
export class TableHopitalComponent implements OnInit {

  Hospitals: Hospital[] = [];
  hospitalData: Hospital = { id: '', nom: '', lieu: '', dateCreation: new Date(''), nombrePatients: 0, nombrePersonnels: 0, is_clinique: false };
  temphospitalData: Hospital = { id: '', nom: '', lieu: '', dateCreation: new Date(''), nombrePatients: 0, nombrePersonnels: 0, is_clinique: false };
  editMode: boolean = false;

  constructor(private HospitalService: HospitalService, private router: Router) { }

  ngOnInit(): void {
    this.HospitalService.getAll().subscribe((hospitals: Hospital[]) => {
      this.Hospitals = hospitals;
    });
  }

  openAddOverlay(): void {
    this.editMode = true;
    this.temphospitalData = { id: '', nom: '', lieu: '', dateCreation: new Date(''), nombrePatients: 0, nombrePersonnels: 0, is_clinique: false };
  }
  addHospital(newHospital: Hospital): void {
    this.HospitalService.add(newHospital).subscribe(() => {
      this.HospitalService.getAll().subscribe((hospitals: Hospital[]) => {
        this.Hospitals = hospitals;
      });
    });
  }

  saveChanges(): void {
    if (this.temphospitalData.id) {
      this.HospitalService.edit(this.temphospitalData).subscribe((updatedHospital) => {
        if (updatedHospital) {
          this.HospitalService.getAll().subscribe((hospitals: Hospital[]) => {
            this.Hospitals = hospitals;
          });
        }
      });
    } else {
      this.addHospital(this.temphospitalData);
    }
    this.editMode = false;
  }

  cancelEdit(): void {
    this.editMode = false;
  }

  editHospital(hospital: Hospital): void {
    this.temphospitalData = { ...hospital };
    this.editMode = true;
  }

  deleteHospital(id: string): void {
  }

}
