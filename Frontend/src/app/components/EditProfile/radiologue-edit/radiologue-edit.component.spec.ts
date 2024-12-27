import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologueEditComponent } from './radiologue-edit.component';

describe('RadiologueEditComponent', () => {
  let component: RadiologueEditComponent;
  let fixture: ComponentFixture<RadiologueEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiologueEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadiologueEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
