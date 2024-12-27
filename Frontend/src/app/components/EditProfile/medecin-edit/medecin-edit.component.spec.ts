import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinEditComponent } from './medecin-edit.component';

describe('MedecinEditComponent', () => {
  let component: MedecinEditComponent;
  let fixture: ComponentFixture<MedecinEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedecinEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedecinEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
