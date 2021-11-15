import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  //le joueur:
 quiEstCo:any;
 coOrNot:any; //co/deco
 adversaire:any;
 couleur:any;
 couleurAdv:any;
 noir:any;
 blanc:any;
// la partie:
 statut:any;//enCours/finie
 numero:any;
 mortsBlancs: any; mortsNoirs:any;
}
