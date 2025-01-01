import { TestBed } from '@angular/core/testing';

import { ShareddpiService } from './shareddpi.service';

describe('ShareddpiService', () => {
  let service: ShareddpiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareddpiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
