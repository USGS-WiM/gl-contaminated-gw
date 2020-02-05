import { Component, OnInit } from '@angular/core';
import ontarioJSON from './OntarioDataStatic.json'; //https://github.com/angular/angular/issues/30802  //https://stackoverflow.com/questions/46991237/how-to-import-json-file-into-a-typescript-file
import basins_2k from './basin_simple_2km.json';
// tslint:disable-next-line: max-line-length
//import ontarioJSON from './OntarioClipped_9.26.json';
import {MapService} from '../../shared/services/map.service'
import {Map} from 'leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'app-mainview-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  collapsedMap;
  collapsedDataPanel;
  
  

  constructor(private _mapService: MapService) { }

  ngOnInit() {

    this._mapService.getUSsiteData();
    this._mapService.map = L.map('map', {
      center: L.latLng(43.3, -84.6),
      zoom: 5,
      renderer: L.canvas()
    });
    
    this._mapService.map.addLayer(this._mapService.baseMaps[this._mapService.chosenBaseLayer]);
    
    

    this._mapService.DataPanelCollapse.subscribe(collapse => {
      this.collapsedDataPanel = collapse;
    });

    
  
    //let usSites = this._mapService.getUSsiteData();

    //this._mapService.map.addLayer(this._mapService.baseMaps[this._mapService.chosenBaseLayer]);
    
    
    //add empty feature group
    //this.sitesLayer = L.featureGroup().addTo(this._mapService.map);
    
    //keeps the geojson always on the top of all other layers
    /* this.map.createPane('basins');
    this.map.createPane('geojson'); */

    
  }

  expandCollapseDataPanel() {
    this._mapService.dataPanelCollapseSubject.next(!this.collapsedDataPanel);
  }

  resizeMap() {
    setTimeout(() => {
        this._mapService.map.invalidateSize()
    }, 200);
  }

}
