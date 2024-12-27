import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { MenuComponent } from "../menu/menu.component";

@Component({
  selector: 'app-profiletemplate',
  imports: [RouterOutlet, HeaderComponent, MenuComponent],
  templateUrl: './profiletemplate.component.html',
  styleUrl: './profiletemplate.component.css'
})
export class ProfiletemplateComponent {

}
