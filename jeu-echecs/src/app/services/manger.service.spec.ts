import { TestBed } from '@angular/core/testing';

import { MangerService } from './manger.service';

describe('MangerService', () => {
  let service: MangerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MangerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
