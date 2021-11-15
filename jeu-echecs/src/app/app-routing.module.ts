import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectComponent } from './components/connect/connect.component';
import { GameComponent } from './components/game/game.component';
import { StatComponent } from './components/stat/stat.component';

const routes: Routes = [
  {
    path:"",
    component:ConnectComponent
  },
  {
    path:"game",
    component: GameComponent
  },
  {
    path:'stat',
    component: StatComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
