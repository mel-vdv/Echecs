import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { DuoService } from './duo.service';
import { MangerBougerGagnerService } from './manger-bouger-gagner.service';
import { VeilleDuRoiService } from './veille-du-roi.service';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class ControleSelonPieceService {

  constructor(
    private wsService: WsService,
    private duoService: DuoService,
    private authService: AuthService,
    private vdrService: VeilleDuRoiService,
    private mbgService : MangerBougerGagnerService
     ) { } 
 //////////////////////////////////////////////////////////////////////////// 

  mouvementAutorise = false;
  lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

/////////////////////////////////////////////////////////////////////////////////////////
  controleSelonPiece() {
    switch (this.duoService.duo[1].type) {

      case 'pion': this.pionBouge(this.duoService.duo[1].lettre, this.duoService.duo[1].chiffre, this.duoService.duo[2].lettre, this.duoService.duo[2].chiffre, this.duoService.duo[2].type);
        break;
      case 'fou': this.fouBouge(this.duoService.duo[1].lettre, this.duoService.duo[1].chiffre, this.duoService.duo[2].lettre, this.duoService.duo[2].chiffre);
        break;
      case 'tour': this.tourBouge(this.duoService.duo[1].lettre, this.duoService.duo[1].chiffre, this.duoService.duo[2].lettre, this.duoService.duo[2].chiffre);
        break;
      case 'roi': this.roiBouge(this.duoService.duo[1].lettre, this.duoService.duo[1].chiffre, this.duoService.duo[2].lettre, this.duoService.duo[2].chiffre);
        break;
      case 'reine': this.reineBouge(this.duoService.duo[1].lettre, this.duoService.duo[1].chiffre, this.duoService.duo[2].lettre, this.duoService.duo[2].chiffre);
        break;
      case 'cheval': this.chevalBouge(this.duoService.duo[1].lettre, this.duoService.duo[1].chiffre, this.duoService.duo[2].lettre, this.duoService.duo[2].chiffre);
        break;
      default: console.log('ceci est une case vide');
    }
    if(this.mouvementAutorise){
      console.log('etape3 ok: controle selon piece');
      this.vdrService.veilleDuRoi(this.authService.couleur, this.authService.couleurAdv);
     
        if(this.vdrService.echecTour || this.vdrService.echecCheval || 
          this.vdrService.echecFou || this.vdrService.echecReine || 
          this.vdrService.echecRoi || this.vdrService.echecPion){
          console.log("etape4 echec: echec a mon roi, mvmt interdit");
          this.vdrService.echec = true; 
          this.duoService.duo.pop();
        }
        else{
          console.log('etape4 ok: mon roi est pas en echec');
          this.vdrService.echec = false;
          this.mbgService.mangerBougerOuGagner();
        }
      
    }
    else{
      console.log('etape 3 echec: mouvement non autorise');
      this.duoService.duo.pop();
    }
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////
 
  pionBouge(lettreA: string, chiffreA: number, lettreB: string, chiffreB: number, typeB: string) {
    let indexA = this.lettres.findIndex(e => e === lettreA);
    let indexB = this.lettres.findIndex(e => e === lettreB);
    if (typeB === 'vide') { // DEPLACEMENT TOUT DROIT :
      if (this.authService.couleur === 'blanc') {
        if ((lettreA === lettreB) && ((chiffreB - chiffreA) === 1)) {
          this.mouvementAutorise = true;
        }
        else {
          this.mouvementAutorise = false;
        }
      }
      else {
        if ((lettreA === lettreB) && ((chiffreA - chiffreB) === 1)) {
          this.mouvementAutorise = true;
        }
        else {
          this.mouvementAutorise = false;
        }
      }
    }
    else { // MANGER EN DIAGONALE:
      if (indexA - indexB === 1 || indexB - indexA === 1) {
        if (this.authService.couleur === 'blanc') {
          if (chiffreB - chiffreA === 1) {
            this.mouvementAutorise = true;
          }
          else {
            this.mouvementAutorise = false;
          }
        }
        else {
          if (chiffreA - chiffreB === 1) {
            this.mouvementAutorise = true;
          }
          else {
            this.mouvementAutorise = false;
          }
        }
      }
      else {
        this.mouvementAutorise = false;
      }
    }
  }
  //--------------------------------------------------------------------------------------------
  fouBouge(lettreA: string, chiffreA: number, lettreB: string, chiffreB: number) {
    let indexA = this.lettres.findIndex(e => e === lettreA);
    let indexB = this.lettres.findIndex(e => e === lettreB);
    const conditionFou = ((chiffreA - chiffreB) === (indexA - indexB) || (chiffreB - chiffreA) === (indexA - indexB));
    if (conditionFou) {
      this.mouvementAutorise = true;
    }
    else {
      this.mouvementAutorise = false;
    }
  }
  //---------------------------------------------------------------------------------------
  vertLibre:any;
  horizLibre:any;

  tourBouge(lettreA: string, chiffreA: number, lettreB: string, chiffreB: number) {

    const conditionTour = (lettreA === lettreB || chiffreA === chiffreB);
    // OBSTACLE SUR LIGNE VERTICALE/
  
    if (lettreA === lettreB) {
      let dea = [];
      let de;
      let a;
      if (chiffreA < chiffreB) { de = chiffreA; a = chiffreB }
      else { a = chiffreA; de = chiffreB }

      for (let i = chiffreA + 1; i < chiffreB; i++) {
        dea.push(lettreA + i);
      }
      let envoi = {
        dea: dea,
        num: this.authService.numero
      }
      this.wsService.send('verifObstacle', envoi);
      this.wsService.listen('verifObstacleS').subscribe((rep) => {

        if (rep) { this.vertLibre = true; } else { this.vertLibre= false; }
      })
    }
    // OBSTACLE SUR LIGNE HORIZONTALE/
    if (chiffreA === chiffreB) {
      let dea = [];
      let de;
      let a;
      if (chiffreA < chiffreB) { de = chiffreA; a = chiffreB }
      else { a = chiffreA; de = chiffreB }

      for (let i = chiffreA + 1; i < chiffreB; i++) {
        dea.push(lettreA + i);
      }
      let envoi = {
        dea: dea,
        num: this.authService.numero
      }
      this.wsService.send('verifObstacle', envoi);
      this.wsService.listen('verifObstacleS').subscribe((rep) => {
      
        if (rep) { this.horizLibre = true; console.log('pas obstacle'); } 
        else { this.horizLibre=false;
          console.log('obstacle'); }

        if (conditionTour && this.vertLibre && this.horizLibre) {
          this.mouvementAutorise = true;
        }
        else {
          this.mouvementAutorise = false;
        }
      })
    }
  }
  //--------------------------------------------------------------------------------------------------------------
  roiBouge(lettreA: string, chiffreA: number, lettreB: string, chiffreB: number) {
    let indexA = this.lettres.findIndex(e => e === lettreA);
    let indexB = this.lettres.findIndex(e => e === lettreB);
    if (
      (chiffreA === chiffreB || (chiffreA - chiffreB) === 1 || (chiffreB - chiffreA) === 1)
      &&
      (indexA === indexB || (indexA - indexB) === 1 || (indexB - indexA) === 1)
    ) {
      this.mouvementAutorise = true;
    }
    else {
      this.mouvementAutorise = false;
    }
  }
  //---------------------------------------------------------------------------------------------
  reineBouge(lettreA: string, chiffreA: number, lettreB: string, chiffreB: number) {
    let indexA = this.lettres.findIndex(e => e === lettreA);
    let indexB = this.lettres.findIndex(e => e === lettreB);
    if (
      (lettreA === lettreB || chiffreA === chiffreB)
      ||
      ((chiffreA - chiffreB) === (indexA - indexB) || (chiffreB - chiffreA) === (indexA - indexB))
    ) {
      this.mouvementAutorise = true;
    }
    else {
      this.mouvementAutorise = false;
    }
  }
  //---------------------------------------------------------------------------------------------
  chevalBouge(lettreA: string, chiffreA: number, lettreB: string, chiffreB: number) {
    let indexA = this.lettres.findIndex(e => e === lettreA);
    let indexB = this.lettres.findIndex(e => e === lettreB);
    if (
      (Math.abs(indexA - indexB) === 1 && Math.abs(chiffreA - chiffreB) === 2) ||
      (Math.abs(indexA - indexB) === 2 && Math.abs(chiffreA - chiffreB) === 1)

    ) {
      this.mouvementAutorise = true;
    }
    else {
      this.mouvementAutorise = false;
    }
  }
}
