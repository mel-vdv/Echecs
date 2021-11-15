import { TestBed } from '@angular/core/testing';

import { ControleSelonPieceService } from './controle-selon-piece.service';

describe('ControleSelonPieceService', () => {
  let service: ControleSelonPieceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControleSelonPieceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
