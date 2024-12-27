import { TestBed } from '@angular/core/testing';

import { ListbiologistesService } from './listbiologistes.service';

describe('ListbiologistesService', () => {
  let service: ListbiologistesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListbiologistesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
