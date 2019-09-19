import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line: max-line-length
import ontarioJSON from './OntarioDataStatic.json'; // https://github.com/angular/angular/issues/30802  //https://stackoverflow.com/questions/46991237/how-to-import-json-file-into-a-typescript-file
declare let L;

@Component({
  selector: 'app-mainview-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  collapsedMap;

  constructor() { }

  ngOnInit() {
    let canadaSites;
    console.log(ontarioJSON);

    const topo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: ''
  });
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: ''
});
    const basinsUrl = 'https://gis.wim.usgs.gov/arcgis/rest/services/SIGL/SIGLMapper/MapServer/3';

    const map = L.map('map').setView([43.4, -84.6], 5);
    const layer = topo.addTo(map);

    const usSites = L.esri.dynamicMapLayer({
      url: 'https://map22.epa.gov/arcgis/rest/services/cimc/Cleanups/MapServer',
      layers: [0]
  }).addTo(map);

    // tslint:disable-next-line: only-arrow-functions
    usSites.bindPopup(function(error, featureCollection) {
    if (error || featureCollection.features.length === 0) {
      return false;
    } else {
      return 'Site ID: ' + featureCollection.features[0].properties.OBJECTID; }
    });

    const basinArea = L.esri.featureLayer({
      url: 'https://gis.wim.usgs.gov/arcgis/rest/services/SIGL/SIGLMapper/MapServer/3',
      simplifyFactor: 0.35
  }).addTo(map);

    canadaSites = L.geoJson(ontarioJSON, {
    pointToLayer(feature, latlng) {
      return L.circleMarker(latlng).bindPopup(feature.properties.name);
    }
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
