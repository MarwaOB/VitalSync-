import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-page1-logo',
  imports: [CommonModule],
  templateUrl: './page1-logo.component.html',
  styleUrl: './page1-logo.component.css'
})
export class Page1LogoComponent implements OnInit {
  backgroundColor: string = "#22797B";
  logoSrc: string = "../../../../assets/images/logo.png";
  showLoginButton: boolean = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.backgroundColor = "#FFFFFF";
      this.logoSrc = "../../../../assets/images/logoVert.png"
      this.showLoginButton = true;
    }, 5000);
  }
}
