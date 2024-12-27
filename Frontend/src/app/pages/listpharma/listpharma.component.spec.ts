import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListpharmaComponent } from './listpharma.component';

describe('ListpharmaComponent', () => {
  let component: ListpharmaComponent;
  let fixture: ComponentFixture<ListpharmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListpharmaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListpharmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
