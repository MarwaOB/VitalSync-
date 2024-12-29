import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCentralEditComponent } from './admin-central-edit.component';

describe('AdminCentralEditComponent', () => {
  let component: AdminCentralEditComponent;
  let fixture: ComponentFixture<AdminCentralEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCentralEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCentralEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
