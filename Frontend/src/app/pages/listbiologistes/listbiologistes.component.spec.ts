import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListbiologistesComponent } from './listbiologistes.component';

describe('ListbiologistesComponent', () => {
  let component: ListbiologistesComponent;
  let fixture: ComponentFixture<ListbiologistesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListbiologistesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListbiologistesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
