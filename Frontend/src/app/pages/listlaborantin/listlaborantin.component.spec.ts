import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListlaborantinComponent } from './listlaborantin.component';

describe('ListlaborantinComponent', () => {
  let component: ListlaborantinComponent;
  let fixture: ComponentFixture<ListlaborantinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListlaborantinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListlaborantinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
