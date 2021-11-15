import { TestBed } from '@angular/core/testing';

import { DuoService } from './duo.service';

describe('DuoService', () => {
  let service: DuoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DuoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
