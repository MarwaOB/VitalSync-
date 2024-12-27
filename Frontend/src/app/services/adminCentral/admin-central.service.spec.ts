import { TestBed } from '@angular/core/testing';

import { AdminCentralService } from './admin-central.service';

describe('AdminCentralService', () => {
  let service: AdminCentralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCentralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
