import { TestBed } from '@angular/core/testing';

import { ListlaborantinService } from './listlaborantin.service';

describe('ListlaborantinService', () => {
  let service: ListlaborantinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListlaborantinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
