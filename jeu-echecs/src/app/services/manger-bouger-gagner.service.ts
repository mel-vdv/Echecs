import { Injectable } from '@angular/core';
import { AuTourDeService } from './au-tour-de.service';
import { AuthService } from './auth.service';
import { BougerService } from './bouger.service';
import { DuoService } from './duo.service';
import { GagnerService } from './gagner.service';
import { MangerService } from './manger.service';

@Injectable({
  providedIn: 'root'
})
export class MangerBougerGagnerService {

  constructor(
    private duoService: DuoService,
    private bougerService: BougerService,
    private mangerService: MangerService,
    private gagnerService: GagnerService,
    private authService: AuthService,
    private auTourDeService: AuTourDeService

  ) { }

  mangerBougerOuGagner() {
    switch (this.duoService.duo[2].piece) {
      case 'vide': this.bougerService.bouger(); this.auTourDeService.auSuivant();
        break;
      case 'rob': this.gagnerService.gagner(this.authService.blanc, this.authService.noir);
        break;
      case 'ron': this.gagnerService.gagner(this.authService.noir, this.authService.blanc);
        break;
      default: this.mangerService.manger();this.bougerService.bouger(); this.auTourDeService.auSuivant();
    }
  }
}
