import { TestBed } from '@angular/core/testing';

import { GagnerService } from './gagner.service';

describe('GagnerService', () => {
  let service: GagnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GagnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
