import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLaborantinsComponent } from './table-laborantins.component';

describe('TableLaborantinsComponent', () => {
  let component: TableLaborantinsComponent;
  let fixture: ComponentFixture<TableLaborantinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableLaborantinsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableLaborantinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
