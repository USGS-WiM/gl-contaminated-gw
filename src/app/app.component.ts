import { Component } from '@angular/core';

import { Sites } from './classes/sites';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gl-contaminated-gw';
  aboutModal;
  expandSidebar;

  constructor(private _SharedModule: SharedModule){}

  lstSites: Sites[];
  ngOnInit(){

    this._SharedModule.getSites()
    .subscribe(
      data=>{
        this.lstSites = data;
      }
    )
  }

}
