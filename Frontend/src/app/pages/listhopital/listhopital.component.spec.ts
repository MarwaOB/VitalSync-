import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListhopitalComponent } from './listhopital.component';

describe('ListhopitalComponent', () => {
  let component: ListhopitalComponent;
  let fixture: ComponentFixture<ListhopitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListhopitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListhopitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
