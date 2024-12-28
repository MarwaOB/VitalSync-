import { Renderer2 } from '@angular/core';
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
  imports: [FormsModule,HttpClientModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent implements OnInit {
  
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private signInService: UserService, private router: Router) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit(): void {
    this.signInService.signIn(this.username, this.password).subscribe(
      response => {
        if (response.status === 'success') {
          // Redirect based on role
          this.router.navigate(['/accueil']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error => {
        this.errorMessage = 'An error occurred during sign-in. Please try again later.';
      }
    );
  }






}
