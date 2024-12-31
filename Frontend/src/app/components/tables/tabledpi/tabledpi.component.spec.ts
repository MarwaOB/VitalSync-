import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabledpiComponent } from './tabledpi.component';

describe('TabledpiComponent', () => {
  let component: TabledpiComponent;
  let fixture: ComponentFixture<TabledpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabledpiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabledpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
