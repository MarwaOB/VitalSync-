import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SigninComponent } from "./components/signin/signin.component";

@Component({
  selector: 'app-root',
  imports: [SigninComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project1';
}
