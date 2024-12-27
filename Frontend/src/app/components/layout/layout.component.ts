import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { MenuComponent } from "../menu/menu.component";
import { RouterOutlet } from '@angular/router';




@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, MenuComponent,RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
