import { Component, OnInit } from '@angular/core';
import * as ontarioJSON from '../../../assets/OntarioDataStatic.json'; //https://github.com/angular/angular/issues/30802  //https://stackoverflow.com/questions/46991237/how-to-import-json-file-into-a-typescript-file
declare let L;

@Component({
  selector: 'app-mainview-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    var siteInfo: any;
    console.log(ontarioJSON);

    var topo = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
      attribution: ""
  });
  var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: ''
});
var basinsUrl = 'https://gis.wim.usgs.gov/arcgis/rest/services/SIGL/SIGLMapper/MapServer/3';

    var map = L.map('map').setView([43.4, -84.6], 5);
    var layer = topo.addTo(map);

    var usSites = L.esri.dynamicMapLayer({
      url: 'https://map22.epa.gov/arcgis/rest/services/cimc/Cleanups/MapServer',
      layers: [0]
  }).addTo(map);

 var basinArea = L.esri.featureLayer({
      url: 'https://gis.wim.usgs.gov/arcgis/rest/services/SIGL/SIGLMapper/MapServer/3',
      simplifyFactor: 0.35
  }).addTo(map); 

  var canadaSites = L.geoJson(ontarioJSON, {
    pointToLayer: function (eature, latlng) {
      return L.circleMarker(latlng);
    }
  }).addTo(map);

    var overlayLayers = {
      "Canadaian Sites": canadaSites,
      "Basin Area": basinArea,
      "U.S. Sites": usSites
    }

var baseMaps = {
    "Satellite": satellite,
    "Topographic": topo
}

L.control.layers(baseMaps, overlayLayers, canadaSites).addTo(map);

  }

}
