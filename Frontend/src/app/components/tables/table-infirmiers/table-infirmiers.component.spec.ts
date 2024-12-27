import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableInfirmiersComponent } from './table-infirmiers.component';

describe('TableInfirmiersComponent', () => {
  let component: TableInfirmiersComponent;
  let fixture: ComponentFixture<TableInfirmiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableInfirmiersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableInfirmiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
