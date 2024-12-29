/*import { Renderer2 } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../shared/models/hospital';
import { HospitalService } from '../../services/hospital/hospital.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import {  HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
@Component({
  selector: 'app-signin',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent implements OnInit {
  private container: HTMLElement | null = null;
  private overlayBtn: HTMLElement | null = null;

  hospitals: Hospital[] = [];
  selectedHospital: number | null = null;
  email: string = '';
  password: string = '';
  acces: boolean = false;
  errorMessage: string;
  
  constructor(private renderer: Renderer2, private signInService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.container = document.getElementById('container');
    this.overlayBtn = document.getElementById('overlayBtn');

    if (this.overlayBtn) {
      this.renderer.listen(this.overlayBtn, 'click', () => this.toggleRightPanel());
    }

    this.hospitalService.getAll().subscribe(date => {
      this.hospitals = date;
    })
  }
  toggleRightPanel(): void {
    if (this.container) {
      this.container.classList.toggle('right-panel-active');
    }

    if (this.overlayBtn) {
      this.overlayBtn.classList.remove('btnScaled');
      window.requestAnimationFrame(() => {
        this.overlayBtn?.classList.add('btnScaled');
      });
    }
  }

  onSubmit(): void {
    this.signInService.signIn(this.username, this.password).subscribe(
      response => {
        if (response.status === 'success') {
          console.log(response.user_data);
          this.errorMessage = '';
          this.router.navigate(['/profileadmin']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error => {
        this.errorMessage = 'An error occurred during sign-in. Please try again later.';
        console.error(error);
      }
    );
  }
  
  onSuivantClick(): void {
    this.toggleRightPanel()
  };


}
*/