import { TestBed } from '@angular/core/testing';

import { ErrorCaseService } from './error-case.service';

describe('ErrorCaseService', () => {
  let service: ErrorCaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
