import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { WsService } from 'src/app/services/ws.service';
import { Router } from '@angular/router';
import { ControleSelonPieceService } from 'src/app/services/controle-selon-piece.service';
import { DuoService } from 'src/app/services/duo.service';
import { VeilleDuRoiService } from 'src/app/services/veille-du-roi.service';
import { AuTourDeService } from 'src/app/services/au-tour-de.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {


  ////////////////////////////   LES SERVICES   ////////////////////////////////////
  constructor(
    private wsService: WsService,
    private authService: AuthService,
    private router: Router,

    private cspService: ControleSelonPieceService,
    private duoService: DuoService,
    private vdrService: VeilleDuRoiService,
    private auTourDeService: AuTourDeService
  ) {

  }
  ////////////////////////    VARIABLES  html   //////////////////////
  quiEstCo: any; adversaire: any
  couleur: any; couleurAdv: any;
  coOrNot: any;

  numeroPartie: any;
  statut: any;
  noir: any; blanc: any;
  auTourDe: any;
  echec: any;
  cases: any;
  mortsNoirs: any; mortsBlancs: any;
  mortB = false; mortN = false;

  duo: any;
  couleur1ok: any;
  ///////////////////////       ON INIT       /////////////////////////////////////
  ngOnInit(): void {
    // données qu'on possède déjà: 
    // a connexion:
    this.quiEstCo = this.authService.quiEstCo;
    this.coOrNot = this.authService.coOrNot;
    // rejoindre : 
    this.adversaire = this.authService.adversaire;
    this.numeroPartie = this.authService.numero;

    this.jouer();

    // M I S E   A    J O U R   G L O B A L E:

    // 1. collection parties:
    this.wsService.listen('faireMajGlobale').subscribe((code) => {
      if (this.numeroPartie === code) {
        this.wsService.send('majGlobale', this.numeroPartie);
      }
    });
    this.wsService.listen('majGlobaleS').subscribe((info: any) => {
      //maj morts:
      this.authService.mortsNoirs = info.mortsNoirs;
      this.authService.mortsBlancs = info.mortsBlancs;
      this.mortsBlancs = this.authService.mortsBlancs;
      this.mortsNoirs = this.authService.mortsNoirs;
      // maj tour:
      this.auTourDeService.auTourDe = info.tour;
      this.auTourDe = this.auTourDeService.auTourDe;
      // maj echec:
      switch (info.a) {
        case 'blanc': this.vdrService.echec = true; this.vdrService.echecNoir = false; this.vdrService.echecBlanc = true; break;
        case 'noir': this.vdrService.echec = true; this.vdrService.echecNoir = true; this.vdrService.echecBlanc = false; break;
        default: this.vdrService.echec = false; this.vdrService.echecNoir = false; this.vdrService.echecBlanc = false;
      }
      //maj fin:
      this.authService.statut = info.statut;
      this.statut = this.authService.statut;
      //2. collection code:
      this.wsService.send('majCases', this.numeroPartie);
      this.wsService.listen('majCasesS').subscribe((cases: any) => {
        this.cases = cases;
      });

    });
  }
  ////////////////////////////////  JOUER  (quand on clic sur le logo)  ///////////////////////////////////////////////////
  jouer() {
    this.wsService.send('rejoindre', this.numeroPartie);
    this.wsService.listen('rejoindreSa').subscribe((positions: any) => {
      this.cases = positions;
      for(let z=0; z<64;z++){
        this.cases[z].classe="normal";
      }
    });
    this.wsService.listen('rejoindreSb').subscribe((partie: any) => {
      this.authService.noir = partie.noir;
      this.authService.blanc = partie.blanc;
      this.authService.statut = partie.statut;
      this.authService.mortsBlancs = partie.mortsBlancs;
      this.authService.mortsNoirs = partie.mortsNoirs;
      this.auTourDeService.auTourDe = partie.auTourDe;
      if (partie.noir === this.quiEstCo) {
        this.authService.couleur = 'noir';
        this.authService.couleurAdv = "blanc";
      }
      else {
        this.authService.couleur = "blanc";
        this.authService.couleurAdv = "noir";
      }
      switch (partie.echecA) {
        case 'noir': this.vdrService.echec = true; this.vdrService.echecNoir = true; this.vdrService.echecBlanc = false; break;
        case 'blanc': this.vdrService.echec = true; this.vdrService.echecNoir = false; this.vdrService.echecBlanc = true; break;
        default: this.vdrService.echec = false; this.vdrService.echecNoir = false; this.vdrService.echecBlanc = false; break;
      }
      // auth service ---> variales html : 
      this.noir = this.authService.noir; this.couleur = this.authService.couleur;
      this.blanc = this.authService.blanc; this.couleurAdv = this.authService.couleurAdv;
      this.statut = this.authService.statut;
      this.mortsBlancs = this.authService.mortsBlancs;
      this.mortsNoirs = this.authService.mortsNoirs;
      this.auTourDe = this.auTourDeService.auTourDe;
      this.echec = this.vdrService.echec;
    });

  }
  /////////////////////////////////////  CLIQUER    ///////////////////////////////////////////
  index1: any;
  toucher(ccouleur: string, ccase: string, ppiece: string, ttype: string, cchiffre: number, llettre: string): void {
    let caseLambda = {
      couleur: ccouleur,
      case: ccase,
      piece: ppiece,
      type: ttype,
      chiffre: cchiffre,
      lettre: llettre
    }

    if (this.auTourDe === this.quiEstCo) {
      this.duoService.duo.push(caseLambda);
      this.duo = this.duoService.duo;
      //premier clic:
      if (this.duoService.duo.length < 3) {
        if (this.duoService.duo[1].couleur === this.couleur) {
          this.index1 = this.cases.findIndex((e: any) => e.case === this.duo[1].case);
          this.couleur1ok = true;
          this.cases[this.index1].classe = "clic1ok";
          console.log('etape1: couleur clic 1 ok');
        }
        else {
          this.couleur1ok = false;
          this.clicError(this.duoService.duo[1].case);
          this.duoService.duo.pop();
          console.log('etape 1 echec: couleur clic 1 error');
        }
        // 2eme case touchee : 
      }
      else {
        if (this.duoService.duo[2].couleur !== this.couleur) {
          this.cases[this.index1].classe = "clic1ok";
          this.cspService.controleSelonPiece();
          console.log('etape2: couleur clic 2 ok')
        }
        else {
          this.clicError(this.duoService.duo[2].case);
          this.duoService.duo.pop();
          console.log("etape2 echec: color clic 2 error");

        }
      }
    }
    else { console.log('ce nest pas votre tour de jouer'); }
  }

  //------------------ effet de cases ----------------------------
  clicError(caze: any) {
    let index = this.cases.findIndex((e: any) => e.case === caze);
    this.cases[index].classe = "clicError";
  }

  ////////////////////////////  SE DECONNECTER  //////////////////////////////
  deco() {
    this.wsService.send('deco', this.quiEstCo);
    this.router.navigate(['']);
  }

  ////////////////////////////  SE RENDRE   ///////////////////////////////
  messageDeFin = '';
  seRendre() {
    let equipe = {
      perdant: this.quiEstCo,
      gagnant: this.adversaire,
      num: this.numeroPartie
    }
    this.wsService.send('fin', equipe);
  }
}