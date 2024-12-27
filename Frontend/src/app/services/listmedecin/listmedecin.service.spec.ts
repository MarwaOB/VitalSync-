import { TestBed } from '@angular/core/testing';

import { ListmedecinService } from './listmedecin.service';

describe('ListmedecinService', () => {
  let service: ListmedecinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListmedecinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
