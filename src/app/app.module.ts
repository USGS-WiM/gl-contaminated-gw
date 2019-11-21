import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { MainviewModule } from './mainview/mainview.module';
import {MapService} from './shared/services/map.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainviewModule,
    SharedModule
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
