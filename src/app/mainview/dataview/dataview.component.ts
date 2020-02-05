import { Component, OnInit } from '@angular/core';
import {MapService} from '../../shared/services/map.service';

@Component({
  selector: 'app-mainview-dataview',
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.scss']
})
export class DataviewComponent implements OnInit {
  dataLoading;
  public collapsedPanel;

  constructor(private _MapService: MapService) { }
  //usData = this._MapService.getUSsiteData();
  //canadaData = this._MapService.getCanadaData();
  

  ngOnInit() {
    this._MapService.DataPanelCollapse.subscribe(collapse => {
      this.collapsedPanel = collapse;
    });

    /* this._MapService.SelectedSite.subscribe((res) => {
        this.usData = res;
    }); */

   /*  this._MapService.SelectedCanadaSite.subscribe((res) => {
        this.canadaData = res;
    }); */
  };

};
