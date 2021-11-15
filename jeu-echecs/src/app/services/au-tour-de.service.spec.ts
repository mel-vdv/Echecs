import { TestBed } from '@angular/core/testing';

import { AuTourDeService } from './au-tour-de.service';

describe('AuTourDeService', () => {
  let service: AuTourDeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuTourDeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
