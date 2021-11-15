import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class GagnerService {

  constructor(
    private wsService: WsService,
    private authService: AuthService
  ) { }

  gagner(gagnant:any, perdant:any){
    
  this.authService.statut = 'finie';


  let equipe = {
    gagnant: gagnant,
    perdant: perdant
  };
  this.wsService.send('fin', equipe);
  }

}
