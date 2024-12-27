import { TestBed } from '@angular/core/testing';

import { AdminSysService } from './admin-sys.service';

describe('AdminSysService', () => {
  let service: AdminSysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminSysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
