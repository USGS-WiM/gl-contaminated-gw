import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/shared/services/map.service';

@Component({
  selector: 'app-mainview-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  expandSidebar;
  showBasemaps;
  chosenBaseLayer;
  showSection2;

  constructor(private _mapService: MapService) { }

  ngOnInit() {
  }
  // called from basemap button click in sidebar
  public toggleLayer(newVal: string) {
    this._mapService.chosenBaseLayer = newVal;
    this._mapService.map.removeLayer(this._mapService.baseMaps['OpenStreetMap']);
    this._mapService.map.removeLayer(this._mapService.baseMaps['Topo']);
    this._mapService.map.removeLayer(this._mapService.baseMaps['Terrain']);
    this._mapService.map.removeLayer(this._mapService.baseMaps['Satellite']);
    this._mapService.map.removeLayer(this._mapService.baseMaps['Gray']);
    this._mapService.map.removeLayer(this._mapService.baseMaps['Nautical']);
    this._mapService.map.addLayer(this._mapService.baseMaps[newVal]);
}
}
