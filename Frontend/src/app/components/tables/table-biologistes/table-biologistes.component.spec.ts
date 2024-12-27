import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBiologistesComponent } from './table-biologistes.component';

describe('TableBiologistesComponent', () => {
  let component: TableBiologistesComponent;
  let fixture: ComponentFixture<TableBiologistesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableBiologistesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableBiologistesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
