import { TestBed } from '@angular/core/testing';

import { BougerService } from './bouger.service';

describe('BougerService', () => {
  let service: BougerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BougerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
