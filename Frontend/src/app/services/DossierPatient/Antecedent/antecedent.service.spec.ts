import { TestBed } from '@angular/core/testing';

import { AntecedentService } from './antecedent.service';

describe('AntecedentService', () => {
  let service: AntecedentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntecedentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
