import { Renderer2 } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../shared/models/hospital';
import { HospitalService } from '../../services/hospital/hospital.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private renderer: Renderer2,
    private hospitalService: HospitalService,
    private router: Router) { }

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
  onSubmitHospital(): void {
    if (this.selectedHospital && this.acces) {
      console.log('Hôpital sélectionné:', this.selectedHospital);
      this.router.navigate(['/accueil']);
    } else {
      if (!this.selectedHospital) {
        console.log('Aucun hôpital sélectionné');
      }
      else {
        console.log('Vous devez d\'abord vous connecter à votre compte pour choisir un hôpital');
      }
    }
  }


  onSubmitSignIn(): void {
    if (this.email && this.password) {
      if (this.email === 'ma_lakache@esi.dz' && this.password === 'aya') {
        this.acces = true;
        console.log('Connexion réussie ! Vous pouvez maintenant choisir un hôpital.');
        this.onSuivantClick();
      } else {
        this.acces = false;
        console.log('Email ou mot de passe incorrect');
      }
    } else {
      console.log('Vous devez entrer un email et un mot de passe.');
    }
  }

  onSuivantClick(): void {
    this.toggleRightPanel()
  };


}
