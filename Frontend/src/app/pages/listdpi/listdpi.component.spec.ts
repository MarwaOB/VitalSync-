import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListdpiComponent } from './listdpi.component';

describe('ListdpiComponent', () => {
  let component: ListdpiComponent;
  let fixture: ComponentFixture<ListdpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListdpiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListdpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
