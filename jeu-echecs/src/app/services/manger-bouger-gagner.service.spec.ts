import { TestBed } from '@angular/core/testing';

import { MangerBougerGagnerService } from './manger-bouger-gagner.service';

describe('MangerBougerGagnerService', () => {
  let service: MangerBougerGagnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MangerBougerGagnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
