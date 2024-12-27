import { TestBed } from '@angular/core/testing';

import { ListradiologueService } from './listradiologue.service';

describe('ListradiologueService', () => {
  let service: ListradiologueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListradiologueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
