import { TestBed } from '@angular/core/testing';

import { InfirmierService } from './infirmier.service';

describe('InfirmierService', () => {
  let service: InfirmierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfirmierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
