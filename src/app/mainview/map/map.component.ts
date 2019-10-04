import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line: max-line-length
//import ontarioJSON from './OntarioClipped_9.26.json';
import {MapService} from '../../shared/services/map.service'
declare let L;

@Component({
  selector: 'app-mainview-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  collapsedMap;

  constructor(private _MapService: MapService) { }

  ngOnInit() {

    let usSites = this._MapService.getUSsiteData();
    let canadaSites = this._MapService.getCanadaData();

    const topo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: ''
  });
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: ''
});
    const basinsUrl = 'https://gis.wim.usgs.gov/arcgis/rest/services/SIGL/SIGLMapper/MapServer/3';

    const map = L.map('map').setView([43.4, -84.6], 5);
    const layer = topo.addTo(map);

    usSites.addTo(map);
    canadaSites.addTo(map);

    // tslint:disable-next-line: only-arrow-functions

    const basinArea = L.esri.featureLayer({
      url: 'https://gis.wim.usgs.gov/arcgis/rest/services/SIGL/SIGLMapper/MapServer/3',
      simplifyFactor: 0.35
  }).addTo(map);

    const overlayLayers = {
      'Basin Area': basinArea,
      'U.S. Sites': usSites,
      'Canadaian Sites': canadaSites
    };

    const baseMaps = {
    Satellite: satellite,
    Topographic: topo
};
    L.control.layers(baseMaps, overlayLayers).addTo(map);
  }
}
