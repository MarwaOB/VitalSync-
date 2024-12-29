import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHopitalComponent } from './table-hopital.component';

describe('TableHopitalComponent', () => {
  let component: TableHopitalComponent;
  let fixture: ComponentFixture<TableHopitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHopitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableHopitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
