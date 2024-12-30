import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Patient } from '../../shared/models/Users/Patientt';

@Component({
  selector: 'app-profile-patient',
  templateUrl: './profile-patient.component.html',
  styleUrls: ['./profile-patient.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ProfilePatientComponent {
  @Input() patientData!: Patient;

  tempProfileData!: Patient
  editMode: boolean = false;

  ngOnInit(): void {
    this.tempProfileData = { ...this.patientData };
  }

  saveChanges(): void {
    this.patientData = { ...this.tempProfileData };
    this.editMode = false;
  }

  cancelEdit(): void {
    this.editMode = false;
  }
  /*addContact() {
    if (!this.tempProfileData.personAContacterTelephone) {
      this.tempProfileData.personAContacterTelephone = [];
    }
    this.tempProfileData.personAContacterTelephone.push('');
  }

  removeContact(index: number) {
    this.tempProfileData.personAContacterTelephone?.splice(index, 1);
  }
  trackByIndex(index: number, item: any) {
    return index;
  }
*/
}


