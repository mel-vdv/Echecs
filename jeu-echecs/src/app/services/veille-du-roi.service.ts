import { Injectable } from '@angular/core';
import { AuTourDeService } from './au-tour-de.service';
import { AuthService } from './auth.service';
import { DuoService } from './duo.service';
import { MangerBougerGagnerService } from './manger-bouger-gagner.service';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class VeilleDuRoiService {

  constructor(

    private wsService: WsService,
    private authService: AuthService,
    private mbgService :  MangerBougerGagnerService,
    private duoService: DuoService,
    private auTourDeService: AuTourDeService
  ) { }
  //---------------------------------------------------------------------------------------------------
  rol: any;//lettre
  roi: any;//index
  roch: any;//chiffre
  lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  echec = false;
  echecBlanc = false; echecNoir = false;
  echecTour = false; echecCheval = false; echecFou: any; echecReine = false; echecRoi = false; echecPion = false;
  //---------------------------------------------------------------------------------------------------
  veilleDuRoi(couleurDuRoi: any, couleurDesAttaquants: any) {
    let veille = {
      num: this.authService.numero, couleur: couleurDesAttaquants, roicouleur: couleurDuRoi
    }
    this.wsService.send("positionDuRoi", veille);
    // etape 1 : LES POSITIONS :
    //position duroi :
    this.wsService.listen('roi').subscribe((d: any) => {
      this.rol = d[0].lettre;
      this.roi = this.lettres.findIndex(e => e === d[0].lettre);
      this.roch = d[0].chiffre;
      let veille2 = {
        num: this.authService.numero,
        couleur: couleurDesAttaquants
      }
      this.wsService.send('positionDesAttaquants', veille2);
  
    // cheval :-----------------------------------------------------------------
    this.wsService.listen('cheval').subscribe((d: any) => {

      for (let x = 0; x < d.length; x++) {
        let cch = d[x].chiffre;
        let ci = this.lettres.findIndex(e => e === d[x].lettre);

        if (
          (Math.abs(ci - this.roi) === 1 && Math.abs(cch - this.roch) === 2) ||
          (Math.abs(ci - this.roi) === 2 && Math.abs(cch - this.roch) === 1)
        ) {

          let echec = { num: this.authService.numero, yn: true, a: couleurDuRoi, par: 'le cheval' };
          this.wsService.send('echecAuRoi', echec);
          this.wsService.listen('echecAuRoiS').subscribe((x: any) => {
            this.echecCheval = true;
          });
        }
        else { this.echecCheval = false; };
      }
    });
    // fou:--------------------------------------------------------------------
    let fous: any = [];
    this.wsService.listen('fou').subscribe((d: any) => {
      for (let x = 0; x < d.length; x++) {
        let fl = d[x].lettre;
        let fch = d[x].chiffre;
        let fi = this.lettres.findIndex(e => e === d[x].lettre);
        fous.push({ lettre: fl, chiffre: fch, index: fi });
        if
          ((fch - this.roch) === (fi - this.roi) || (this.roch - fch) === (fi - this.roi)) {
          let echec = { num: this.authService.numero, yn: true, a: couleurDuRoi, par: 'le fou' };
          this.wsService.send('echecAuRoi', echec);
          this.wsService.listen('echecAuRoiS').subscribe((x: any) => {
            this.echecFou = true;
          });
        }
        else { this.echecFou = false; }
      }
    });
    //pion  :-----------------------------------------------------------------
    let pions: any = [];
    this.wsService.listen('pion').subscribe((d: any) => {
      for (let x = 0; x < d.length; x++) {

        let pl = d[x].lettre; let pch = d[x].chiffre;
        let pi = this.lettres.findIndex(e => e === d[x].lettre);
        pions.push({ lettre: pl, chiffre: pch, index: pi });

        if ((pch - this.roch === 1) && (pi - this.roi === 1 || this.roi - pi === 1)) {
          console.log("roi mis en échec par le pion ");
          let echec = { num: this.authService.numero, yn: true, a: couleurDuRoi, par: 'le pion' };
          this.wsService.send('echecAuRoi', echec);
          this.wsService.listen('echecAuRoiS').subscribe((x: any) => {
            this.echecPion = true;
          });
        }
        else { this.echecPion = false; }
      }
    });
    //tour:------------------------------------------------------------------
    let tours: any = [];
    this.wsService.listen('tour').subscribe((d: any) => {
      for (let x = 0; x < d.length; x++) {
        let tl = d[x].lettre; let tch = d[x].chiffre;
        let ti = this.lettres.findIndex(e => e === d[x].lettre);
        tours.push({ lettre: tl, chiffre: tch, index: ti });
        if (tl === this.rol || tch === this.roch) {
          let echec = { num: this.authService.numero, yn: true, a: couleurDuRoi, par: 'la tour' };
          this.wsService.send('echecAuRoi', echec);
          this.wsService.listen('echecAuRoiS').subscribe((x: any) => {
            this.echecTour = true;
          });
        }
        else { this.echecTour = false; }
      }
    });
    // reine:---------------------------------------------------------------
    this.wsService.listen('reine').subscribe((d: any) => {
      let rnl = d[0].lettre; let rnch = d[0].chiffre;
      let rni = this.lettres.findIndex(e => e === d[0].lettre);
      if (
        (rnl === this.rol || rnch === this.roch)
        ||
        ((rnch - this.roch) === (rni - this.roi) || (this.roch - rnch) === (rni - this.roi))
      ) {
        let echec = { num: this.authService.numero, yn: true, a: couleurDuRoi, par: 'la reine' };
        this.wsService.send('echecAuRoi', echec);
        this.wsService.listen('echecAuRoiS').subscribe((x: any) => {
          this.echecReine = true;
        });
      }
    });
    // roi :--------------------------------------------------------------------
    this.wsService.listen('roiAttaquant').subscribe((d: any) => {

      let roich = d[0].chiffre;
      let roii = this.lettres.findIndex(e => e === d[0].lettre);
      if (
        (roich === this.roch || (roich - this.roch) === 1 || (this.roch - roich) === 1)
        &&
        (roii === this.roi || (roii - this.roi) === 1 || (this.roi - roii) === 1)
      ) {
        let echec = { num: this.authService.numero, yn: true, a: couleurDuRoi, par: 'le roi' };
        this.wsService.send('echecAuRoi', echec);
        this.wsService.listen('echecAuRoiS').subscribe((x: any) => {
          this.echecRoi = true;
        });
      }
      else { this.echecRoi = false; }
    }); 
    //-*-----------------   mon roi : 
    if(couleurDuRoi ===  this.authService.couleur){
      if (this.echecTour || this.echecCheval || this.echecFou ||
        this.echecReine || this.echecRoi || this.echecPion){
       console.log("echec à mon roi, mvmt interdit");
       this.echec = true; 
       this.duoService.duo.pop();
     }
     else{
       console.log('le roi ennnemi est pas en echec');
       this.echec = false;
       this.mbgService.mangerBougerOuGagner();
     }
    }//---------------------- le roi ennemi : 
    else{
       if (this.echecTour || this.echecCheval || this.echecFou ||
      this.echecReine || this.echecRoi || this.echecPion){
     console.log("echec au roi ennemi");
     this.echec = true; 
     this.auTourDeService.auSuivant();
   }
   else{
     console.log('le roi ennnemi est pas en echec');
     this.echec = false;
     this.auTourDeService.auSuivant();
   }
    }
    //////////////////////////////
    });
  }
}
