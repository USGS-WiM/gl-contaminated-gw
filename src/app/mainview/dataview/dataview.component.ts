import { Component, OnInit, Injectable } from '@angular/core';
import {MapService} from '../../shared/services/map.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-mainview-dataview',
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.scss']
})
export class DataviewComponent implements OnInit {
  dataLoading;
  public collapsedPanel;
  public usData: any;
  public canData: any;



  constructor(private _MapService: MapService) {}

/*   usData = this._MapService.getUSsiteData();
  canData = this._MapService.getCanSiteData(); */

  ngOnInit() {
    this._MapService.DataPanelCollapse.subscribe(collapse => {
      this.collapsedPanel = collapse;
    });

    this._MapService._selectedSiteSubject.subscribe((data) => {
      this.usData = data;
    });
    
    this._MapService._selectedCanSiteSubject.subscribe((res) => {
      this.canData = res;
   });
  };


};
