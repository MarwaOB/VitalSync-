import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';  // Import RouterModule

@Component({
  selector: 'app-menu',
  imports: [CommonModule,RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  submenuVisible: boolean = false;

  toggleSubmenu(event: Event): void {
    event.stopPropagation();
    this.submenuVisible = !this.submenuVisible;
  }
}
