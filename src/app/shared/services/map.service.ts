import { Injectable } from '@angular/core';
//import ontarioJSONdata from '../../../assets/OntarioClipped_9.26.json';
import { Observable, Subject } from 'rxjs';
import { Map, GeoJSON, latLng, LatLng} from 'leaflet';
declare let L;
import 'leaflet';
import * as esri from 'esri-leaflet';
import { PromiseType } from 'protractor/built/plugins';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public map: Map;
  public legend: any;
  public baseMaps: any;
  public auxLayers: any;
  public chosenBaseLayer: string;
  public sitesLayer: L.FeatureGroup<any>;

  public siteColors = ['red', 'blue', 'green', 'gray'];
  public siteCategories = ['Active', 'Suspected', 'Closed', 'Other']

  public _selectedSiteSubject = new Subject();
  public get SelectedSite(): Observable<any> {
      return this._selectedSiteSubject.asObservable();
  }

  public _selectedCanSiteSubject = new Subject();
  public get SelectedCanSite(): Observable<any> {
    return this._selectedCanSiteSubject.asObservable();
  }

  public _selectedCanadaSiteSubject = new Subject();
  public get SelectedCanadaSite(): Observable<any> {
      return this._selectedCanadaSiteSubject.asObservable();
  }

  public dataPanelCollapseSubject = new Subject();
  public get DataPanelCollapse(): Observable<any> {
    return this.dataPanelCollapseSubject.asObservable();
  }

  constructor() {
    this.chosenBaseLayer = 'Topo';

    this.baseMaps = {// {s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png  
      OpenStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        zIndex: 1,
        maxZoom: 20,
        attribution: 'Imagery from <a href="https://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }),
      Topo: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
        zIndex: 1,
        attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
      }),
      CartoDB: L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
        zIndex: 1,
        attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='https://cartodb.com/attributions'>CartoDB</a>"
      }),
      Satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'//,
        //maxZoom: 10
      }),
      Terrain: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
        maxZoom: 13,
        zIndex: 1
      }),
      Gray: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16,
        zIndex: 1
      }),
      Nautical: esri.imageMapLayer({
        url: 'https://seamlessrnc.nauticalcharts.noaa.gov/arcgis/rest/services/RNC/NOAA_RNC/ImageServer',
        zIndex: 1
      })
    };

    this.auxLayers = {
      basinArea: esri.dynamicMapLayer({
        url: 'https://gis.wim.usgs.gov/arcgis/rest/services/SIGL/SIGLMapper/MapServer',
        pane: 'basins',
        layers: [3],
        opacity: .4
      })
    };
   }

  public getUSsiteData(){
      //const self = this;
      const usSites = esri.dynamicMapLayer({
        url: 'https://map22.epa.gov/arcgis/rest/services/cimc/Cleanups/MapServer',
        pane: 'sites',
        layers: [0],
        layerDefs: { 0: "EPA_REGION_CODE = '05' OR EPA_REGION_CODE = '02' OR EPA_REGION_CODE = '03'" }
      })
      usSites.bindPopup((error, featureCollection) => {
        if (error || featureCollection.features.length === 0) {
          return false;
        } else {
          let props = featureCollection.features[0].properties;
          this._selectedSiteSubject.next(featureCollection.features[0].properties);  //to use later in data view
          //superfund
          if (props['Superfund Site ID'] != "Null"){
            return "Superfund Site: " + props['Superfund Site ID'];
          }
          if (props['Brownfield Property ID'] != "Null"){
            return "Brownfield Site: " + props['Brownfield Property ID'];
          }
          if (props['OSC Site ID'] != "Null"){
            return "OSC Site: " + props['OSC Site ID'];
          }
          if (props['OSC Site ID'] != "Null"){
            return "OSC Site: " + props['OSC Site ID'];
          }
          if (props['OSC Site ID'] != "Null"){
            return "OSC Site: " + props['OSC Site ID'];
          }
          if (props['Federal Facilities*'] != "Null"){
            //can further differentiate here
            return "Federal Facility Agency: " + props['Federal Facilities Docket Federal Agency'] +
            "<br>EPA ID: " + props['EPA ID'];
          } else{
            return "Unknown Site Type";
          }
        };
      });
      return usSites;
    }

  public getCanSiteData() {
    //const self = this;
    const canSites = esri.featureLayer({
      url: 'https://services1.arcgis.com/VrOlGiblUSWCQy8E/ArcGIS/rest/services/Federal_Contaminated_Sites/FeatureServer/0',
      pane: 'sites',
      //layers: [0]
      //layerDefs: { 0: "Province = 'Ontario'"}
      where: "Province = 'Ontario'",
      pointToLayer: (feature, latlng) => {
        const marker = this.setMarker(feature);
        return L.circleMarker(latlng, marker);
      }
      // L.icon = function(options){
      //   return new L.icon(options);
      // }
      })

    canSites.bindPopup(layer => {
      let prop = layer.feature.properties;
      if (prop.propertyTypeName == "Federal"){
        return '<b>Property Type: Federal Site <b><br>' +
        'Site ID: ' + layer.feature.properties.federalSiteID +
        '<br>Site Name: ' + layer.feature.properties.siteName +
        '<br>Class: ' + layer.feature.properties.class +
        '<br>Action Plan: ' + layer.feature.properties.actionPlan
      }
      if (prop.propertyTypeName == "Canada Lan"){
        return '<b>Property Type: Canada Land <b><br>' +
        'Site ID: ' + layer.feature.properties.federalSiteID +
        '<br>Site Name: ' + layer.feature.properties.siteName +
        '<br>Class: ' + layer.feature.properties.class +
        '<br>Action Plan: ' + layer.feature.properties.actionPlan
      }
      if (prop.propertyTypeName == "Non-Federa"){
        return '<b>Property Type: Non-Federal <b><br>' +
        'Site ID: ' + layer.feature.properties.federalSiteID +
        '<br>Site Name: ' + layer.feature.properties.siteName +
        '<br>Class: ' + layer.feature.properties.class +
        '<br>Action Plan: ' + layer.feature.properties.actionPlan
      }
      
     })

     return canSites;
  }

  // public getCanadaData(geoJSON){
  //   const self = this
  //   const canadaSites = L.geoJSON(geoJSON, {
  //     pointToLayer(feature, latlng) {
  //       const marker = self.setMarker(feature, self);
  //       return L.circleMarker(latlng, marker);
  //     },
  //     onEachFeature: (feature,lay) => {
  //       lay.bindPopup(
  //         '<b>Site Name: </b>' +
  //         feature.properties.Name +
  //         '<br/><b>Federal Site Identifier: </b>' +
  //         feature.properties.FederalSit +
  //         '<br/><b>Municipality: </b>' +
  //         feature.properties.Municipali +
  //         '<br/><b>Reason: </b>' +
  //         feature.properties.ReasonForF
          
  //       )
  //       lay.on('click', function(e) {
  //         self._selectedCanadaSiteSubject.next(e.target.feature.properties.Name);
  //       })
  //     }
  //   })
  //   return canadaSites;
  // }
  
  public setMarker(feature){
    let attr = feature.properties.siteStatus;
    let fillColor;
    switch(attr){
      case 'Closed':
        fillColor = 'green';
        break;
      case "Suspected":
        fillColor = 'blue';
        break;
      case "Active":
        fillColor = 'red';
        break;
      default:
        fillColor = 'gray';
    }
    
    
    return {
      pane: 'sites',
      radius: 4,
      fillColor: fillColor,
      weight: 0,
      opacity: 1,
      fillopacity: .25
    }

  }

  


}

