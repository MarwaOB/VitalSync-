import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiologisteEditComponent } from './biologiste-edit.component';

describe('BiologisteEditComponent', () => {
  let component: BiologisteEditComponent;
  let fixture: ComponentFixture<BiologisteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiologisteEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiologisteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
