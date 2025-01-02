import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Page1AccueilComponent } from './page1-accueil.component';

describe('Page1AccueilComponent', () => {
  let component: Page1AccueilComponent;
  let fixture: ComponentFixture<Page1AccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Page1AccueilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Page1AccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
