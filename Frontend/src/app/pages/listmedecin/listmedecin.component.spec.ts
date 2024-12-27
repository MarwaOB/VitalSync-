import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListmedecinComponent } from './listmedecin.component';

describe('ListmedecinComponent', () => {
  let component: ListmedecinComponent;
  let fixture: ComponentFixture<ListmedecinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListmedecinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListmedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
