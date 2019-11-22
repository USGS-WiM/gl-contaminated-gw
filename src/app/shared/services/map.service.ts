import { Injectable } from '@angular/core';
import ontarioJSON from '../../mainview/map/OntarioClipped_9.26.json'
import { Observable, Subject } from 'rxjs';
declare let L;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  public _selectedSiteSubject = new Subject();
  public get SelectedSite(): Observable<any> {
      return this._selectedSiteSubject.asObservable();
  }
  public _selectedCanadaSiteSubject = new Subject();
  public get SelectedCanadaSite(): Observable<any> {
      return this._selectedCanadaSiteSubject.asObservable();
  }

  constructor() { }

  getUSsiteData(){
      const usSites = L.esri.dynamicMapLayer({
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
  getCanadaData(){
    const self = this
    const canadaSites = L.geoJson(ontarioJSON, {
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
