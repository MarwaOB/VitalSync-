import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborantinEditComponent } from './laborantin-edit.component';

describe('LaborantinEditComponent', () => {
  let component: LaborantinEditComponent;
  let fixture: ComponentFixture<LaborantinEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaborantinEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaborantinEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
