import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDpiComponent } from './patient-dpi.component';

describe('PatientDpiComponent', () => {
  let component: PatientDpiComponent;
  let fixture: ComponentFixture<PatientDpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDpiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientDpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
