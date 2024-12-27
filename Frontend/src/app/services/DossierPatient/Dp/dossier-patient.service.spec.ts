import { TestBed } from '@angular/core/testing';

import { DossierPatientService } from './dossier-patient.service';

describe('DossierPatientService', () => {
  let service: DossierPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DossierPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
