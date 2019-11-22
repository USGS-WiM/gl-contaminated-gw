import { Component, OnInit } from '@angular/core';
import ontarioJSON from './OntarioDataStatic.json'; //https://github.com/angular/angular/issues/30802  //https://stackoverflow.com/questions/46991237/how-to-import-json-file-into-a-typescript-file
import basins_2k from './basin_simple_2km.json';
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
    var siteInfo: any;
    var canadaSites;
    
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

    /* var usSites = L.esri.get('https://map22.epa.gov/arcgis/rest/services/cimc/Cleanups/MapServer', {
      spatialRel: "esriSpatialRelIntersects",
      geometryType: "esriGeometryPolygon",
      geometry: L.esri.Utils.geojsonToArcGIS(basins_2k)
    }, function(error, response){
      var geojson = L.esri.Utils.responseToFeatureCollection(response);
      console.log("SUCCESS!  " + geojson);
    }).addTo(map); */

    var usSites = L.esri.dynamicMapLayer({
      url: 'https://map22.epa.gov/arcgis/rest/services/cimc/Cleanups/MapServer',
      layers: [0],
      layerDefs: {0: "EPA_REGION_CODE = '05' OR EPA_REGION_CODE = '02' OR EPA_REGION_CODE = '03'"}
  }).addTo(map);

  usSites.bindPopup(function (error, featureCollection) {
    if(error || featureCollection.features.length === 0) {
      return false;
    } else {
      return 'Site ID: ' + featureCollection.features[0].properties.OBJECTID;}
    }); 

 var basinArea = L.esri.featureLayer({
      url: 'https://gis.wim.usgs.gov/arcgis/rest/services/SIGL/SIGLMapper/MapServer/3',
      simplifyFactor: 0.35
  }).addTo(map); 

  canadaSites = L.geoJson(ontarioJSON, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng).bindPopup(feature.properties.name);
    }
  }).addTo(map);

    var overlayLayers = {
      "Basin Area": basinArea,
      "U.S. Sites": usSites,
      "Canadaian Sites": canadaSites
    }

var baseMaps = {
    "Satellite": satellite,
    "Topographic": topo
}
L.control.layers(baseMaps, overlayLayers).addTo(map);
  }
}
