import { Injectable } from '@angular/core';
import ontarioJSONdata from '../../../assets/OntarioClipped_9.26.json';
import { Observable, Subject } from 'rxjs';
import { Map, GeoJSON} from 'leaflet';

import * as L from 'leaflet';
import * as esri from 'esri-leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public map: Map;
  public baseMaps: any;
  public chosenBaseLayer: string;

  public _selectedSiteSubject = new Subject();
  public get SelectedSite(): Observable<any> {
      return this._selectedSiteSubject.asObservable();
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
    this.chosenBaseLayer = 'Terrain';
    
    this.baseMaps = {// {s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png  
            OpenStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                zIndex: 1,
                maxZoom: 20,
                attribution: 'Imagery from <a href="https://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }),
            Topo: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
                zIndex:1,
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
                zIndex:1
            }),
            Nautical: esri.imageMapLayer({
                url: 'https://seamlessrnc.nauticalcharts.noaa.gov/arcgis/rest/services/RNC/NOAA_RNC/ImageServer',
                zIndex: 1
            })
      };
   }

  getUSsiteData(){
      const usSites = esri.dynamicMapLayer({
        url: 'https://map22.epa.gov/arcgis/rest/services/cimc/Cleanups/MapServer',
        layers: [0],
        layerDefs: { 0: "EPA_REGION_CODE = '05' OR EPA_REGION_CODE = '02' OR EPA_REGION_CODE = '03'" }
    })
      // tslint:disable-next-line: only-arrow-functions
      const self = this
      usSites.bindPopup(function(error, featureCollection) {
      if (error || featureCollection.features.length === 0) {
        return false;
      } else {
        self._selectedSiteSubject.next(featureCollection.features[0].properties.OBJECTID);
        return 'Site ID: ' + featureCollection.features[0].properties.OBJECTID; };
      });
      return usSites;
  }
  getCanadaData(ontarioJSONdata){
    const self = this
    const canadaSites = L.geoJSON(ontarioJSONdata, {
      pointToLayer(feature, latlng) {
        return L.circleMarker(latlng).bindPopup(feature.properties.Name);
      },
      onEachFeature: (feature,lay) => {
        lay.on('click', function(e) {
          self._selectedCanadaSiteSubject.next(e.target.feature.properties.Name);
        })
      }
    })
    return canadaSites;
  }


}

