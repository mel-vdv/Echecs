import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { WsService } from 'src/app/services/ws.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit {

  constructor(
    private wsService: WsService,
    private authService: AuthService,
    private router: Router
  ) { }
  quiestco:any; 
  listWin:any;
  listLost:any;

  ngOnInit(): void {
    this.quiestco = this.authService.quiEstCo;
  
    this.wsService.send('stat', this.quiestco);
    this.wsService.listen('winS').subscribe((list:any)=>{
      this.listWin = list; });
    this.wsService.listen('lostS').subscribe((list:any)=>{
      this.listLost = list;
    });
  }
  //////////////////////////////
  deco(){
    this.wsService.send('deco',this.quiestco);
    this.router.navigate(['']);
  }

}
