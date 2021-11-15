import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './components/game/game.component';
import { ConnectComponent } from './components/connect/connect.component';
import { FormsModule } from '@angular/forms';
import { StatComponent } from './components/stat/stat.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    ConnectComponent,
    StatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
