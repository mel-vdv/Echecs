import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { DuoService } from './duo.service';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class AuTourDeService {

  constructor(
    private authService: AuthService,
    private wsService: WsService,
    private duoService: DuoService
  ) { }
  auTourDe: any;

  auSuivant() {
    this.auTourDe = this.authService.adversaire;
    let envoi = {
      adversaire: this.authService.adversaire,
      code: this.authService.numero
    }
    this.wsService.send('auTourDe', envoi);
    this.duoService.duo.pop();
    this.duoService.duo.pop();

  }
}