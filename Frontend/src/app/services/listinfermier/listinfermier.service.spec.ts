import { TestBed } from '@angular/core/testing';

import { ListinfermierService } from './listinfermier.service';

describe('ListinfermierService', () => {
  let service: ListinfermierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListinfermierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
