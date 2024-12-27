import { TestBed } from '@angular/core/testing';

import { ListpharmaService } from './listpharma.service';

describe('ListpharmaService', () => {
  let service: ListpharmaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListpharmaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
