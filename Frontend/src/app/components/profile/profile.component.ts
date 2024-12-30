import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Medecin } from '../../shared/models/Users/Medecin';
import { User } from '../../shared/models/Users/Usert';
import { Biologiste } from '../../shared/models/Users/Biologiste';
import { Laborantin } from '../../shared/models/Users/Laborantin';
import { Radiologue } from '../../shared/models/Users/Radiologue';
import { Pharmacien } from '../../shared/models/Users/Pharmacien';
import { Infirmier } from '../../shared/models/Users/Infermier';
import { Patient } from '../../shared/models/Users/Patient';
import { AdminCentral } from '../../shared/models/Users/AdminCentral';
import { AdminSys } from '../../shared/models/Users/AdminSys';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() profileData!: User | Medecin | Biologiste | Laborantin | Radiologue | Pharmacien | Infirmier | Patient | AdminCentral | AdminSys;

  tempProfileData!: User | Medecin | Biologiste | Laborantin | Radiologue | Pharmacien | Infirmier | Patient | AdminCentral | AdminSys;
  editMode: boolean = false;
user: any = null;

  constructor(private userService: UserService  ,private router: Router) {

  }



  ngOnInit(): void {
    // Access user data directly or subscribe to changes
    this.user = this.userService.user;
  }


  cancelEdit(): void {
    this.editMode = false;
  }
}
