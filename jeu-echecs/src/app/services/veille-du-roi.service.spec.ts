import { TestBed } from '@angular/core/testing';

import { VeilleDuRoiService } from './veille-du-roi.service';

describe('VeilleDuRoiService', () => {
  let service: VeilleDuRoiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VeilleDuRoiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
