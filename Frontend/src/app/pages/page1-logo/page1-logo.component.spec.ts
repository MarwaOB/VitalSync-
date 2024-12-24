import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Page1LogoComponent } from './page1-logo.component';

describe('Page1LogoComponent', () => {
  let component: Page1LogoComponent;
  let fixture: ComponentFixture<Page1LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Page1LogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Page1LogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
