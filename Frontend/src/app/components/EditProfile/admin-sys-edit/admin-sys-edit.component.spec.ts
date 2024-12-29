import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSysEditComponent } from './admin-sys-edit.component';

describe('AdminSysEditComponent', () => {
  let component: AdminSysEditComponent;
  let fixture: ComponentFixture<AdminSysEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSysEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSysEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
