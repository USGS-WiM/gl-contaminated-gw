import { Component, OnInit } from '@angular/core';
import ontarioJSON from './OntarioDataStatic.json'; //https://github.com/angular/angular/issues/30802  //https://stackoverflow.com/questions/46991237/how-to-import-json-file-into-a-typescript-file
import basins_2k from './basin_simple_2km.json';
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

    /* var usSites = L.esri.get('https://map22.epa.gov/arcgis/rest/services/cimc/Cleanups/MapServer', {
      spatialRel: "esriSpatialRelIntersects",
      geometryType: "esriGeometryPolygon",
      geometry: L.esri.Utils.geojsonToArcGIS(basins_2k)
    }, function(error, response){
      var geojson = L.esri.Utils.responseToFeatureCollection(response);
      console.log("SUCCESS!  " + geojson);
    }).addTo(map); */

    /* usSites = L.esri.dynamicMapLayer({
      url: 'https://map22.epa.gov/arcgis/rest/services/cimc/Cleanups/MapServer',
      layers: [0],
      layerDefs: {0: "EPA_REGION_CODE = '05' OR EPA_REGION_CODE = '02' OR EPA_REGION_CODE = '03'"}
  }).addTo(map); */

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
