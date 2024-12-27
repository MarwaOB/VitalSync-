import { TestBed } from '@angular/core/testing';

import { BiologisteService } from './biologiste.service';

describe('BiologisteService', () => {
  let service: BiologisteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiologisteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
