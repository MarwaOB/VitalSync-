import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListradiologueComponent } from './listradiologue.component';

describe('ListradiologueComponent', () => {
  let component: ListradiologueComponent;
  let fixture: ComponentFixture<ListradiologueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListradiologueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListradiologueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
