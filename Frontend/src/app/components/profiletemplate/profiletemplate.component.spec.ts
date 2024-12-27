import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiletemplateComponent } from './profiletemplate.component';

describe('ProfiletemplateComponent', () => {
  let component: ProfiletemplateComponent;
  let fixture: ComponentFixture<ProfiletemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfiletemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfiletemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
