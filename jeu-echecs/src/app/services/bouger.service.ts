import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { DuoService } from './duo.service';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class BougerService {

  constructor(
    private wsService: WsService,
    private authService: AuthService,
    private duoService: DuoService

  ) { }

  mvmt:any;
  bouger() {
    this.mvmt = {
      num: this.authService.numero,
      fromCase: this.duoService.duo[1].case,
      toCase: this.duoService.duo[2].case,
      fromPiece: this.duoService.duo[1].piece,
      toPiece: this.duoService.duo[2].piece,
      fromType: this.duoService.duo[1].type,
      toType: this.duoService.duo[2].type,
      fromChiffre: this.duoService.duo[1].chiffre,
      toChiffre: this.duoService.duo[2].chiffre,
      fromLettre: this.duoService.duo[1].lettre,
      toLettre: this.duoService.duo[2].lettre,
      fromCouleur: this.duoService.duo[1].couleur,
      toCouleur: this.duoService.duo[2].couleur
    }
  
    this.wsService.send('bouger', this.mvmt);
  
  }
}
