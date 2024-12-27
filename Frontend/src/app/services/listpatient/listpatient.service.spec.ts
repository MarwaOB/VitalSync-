import { TestBed } from '@angular/core/testing';

import { ListpatientService } from './services/listpatient/listpatient.service';

describe('ListpatientService', () => {
  let service: ListpatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListpatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
