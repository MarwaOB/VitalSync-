import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMedecinsComponent } from './table-medecins.component';

describe('TableMedecinsComponent', () => {
  let component: TableMedecinsComponent;
  let fixture: ComponentFixture<TableMedecinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableMedecinsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableMedecinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
