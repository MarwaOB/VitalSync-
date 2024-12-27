import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacienEditComponent } from './pharmacien-edit.component';

describe('PharmacienEditComponent', () => {
  let component: PharmacienEditComponent;
  let fixture: ComponentFixture<PharmacienEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacienEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacienEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
