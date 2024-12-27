import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListinfermierComponent } from './listinfermier.component';

describe('ListinfermierComponent', () => {
  let component: ListinfermierComponent;
  let fixture: ComponentFixture<ListinfermierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListinfermierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListinfermierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
