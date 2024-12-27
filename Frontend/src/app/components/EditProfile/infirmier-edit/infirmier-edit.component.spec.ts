import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfirmierEditComponent } from './infirmier-edit.component';

describe('InfirmierEditComponent', () => {
  let component: InfirmierEditComponent;
  let fixture: ComponentFixture<InfirmierEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfirmierEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfirmierEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
