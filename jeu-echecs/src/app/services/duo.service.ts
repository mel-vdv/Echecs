import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DuoService {

duo = [
    {
      couleur: 'blanc',
      case: "case",
      piece: "piece",
      type: 'pion',
      chiffre: 0,
      lettre: "x"
    }];

  constructor() { }
}
