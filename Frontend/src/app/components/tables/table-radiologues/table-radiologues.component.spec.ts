import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRadiologuesComponent } from './table-radiologues.component';

describe('TableRadiologuesComponent', () => {
  let component: TableRadiologuesComponent;
  let fixture: ComponentFixture<TableRadiologuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableRadiologuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableRadiologuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
