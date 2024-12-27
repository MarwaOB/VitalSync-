import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePharmComponent } from './table-pharm.component';

describe('TablePharmComponent', () => {
  let component: TablePharmComponent;
  let fixture: ComponentFixture<TablePharmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePharmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablePharmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
