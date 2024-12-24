import { Component, OnInit } from '@angular/core';
import { HeaderService, UserProfile } from '../../services/header/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userProfile!: UserProfile;

  constructor(private headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.userProfile$.subscribe(profile => {
      this.userProfile = profile;
    });
  }
}
