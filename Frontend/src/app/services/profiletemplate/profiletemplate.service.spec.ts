import { TestBed } from '@angular/core/testing';

import { ProfiletemplateService } from './profiletemplate.service';

describe('ProfiletemplateService', () => {
  let service: ProfiletemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfiletemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
