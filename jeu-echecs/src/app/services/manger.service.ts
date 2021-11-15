import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BougerService } from './bouger.service';
import { DuoService } from './duo.service';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class MangerService {

  constructor(
    private wsService: WsService,
    private duoService: DuoService,
    private authService: AuthService
  ) { }

  manger() {

    let proie = {
      piece: this.duoService.duo[2].piece,
      color: this.duoService.duo[2].couleur,
      num: this.authService.numero
    }
    this.wsService.send('manger', proie);

  }
}
