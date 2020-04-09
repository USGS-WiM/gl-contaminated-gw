import { Component, OnInit } from '@angular/core';
import ontarioJSON from '../../../assets/OntarioClipped_9.26.json'; //https://github.com/angular/angular/issues/30802  //https://stackoverflow.com/questions/46991237/how-to-import-json-file-into-a-typescript-file
import basins_2k from './basin_simple_2km.json';
// tslint:disable-next-line: max-line-length
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
  legendExpanded = true;

  constructor(private _mapService: MapService) { }

  ngOnInit() {

    let usSites = this._mapService.getUSsiteData();

    let canSites = this._mapService.getCanSiteData();

    // let canadaSites = this._mapService.getCanadaData(ontarioJSON);
    
    this._mapService.map = L.map('map', {
      center: L.latLng(43.3, -84.6),
      zoom: 5,
      renderer: L.canvas()
    });
    //keeps the geojson always on the top of all other layers
    this._mapService.map.createPane('basins');
    //this._mapService.map.getPane('basins').style.zIndex = '1';
    this._mapService.map.createPane('sites');
    this._mapService.map.addLayer(this._mapService.baseMaps[this._mapService.chosenBaseLayer]);
    this._mapService.map.addLayer(this._mapService.auxLayers['basinArea'])
    
    this._mapService.sitesLayer = L.featureGroup().addTo(this._mapService.map)
    usSites.addTo(this._mapService.sitesLayer);
    canSites.addTo(this._mapService.sitesLayer);
    // canadaSites.addTo(this._mapService.sitesLayer);
    this._mapService.map.addLayer(this._mapService.sitesLayer);



    this._mapService.legend = new L.Control({position: 'bottomright'});

    this._mapService.legend.onAdd = function (map){
      const div = L.DomUtil.create("div", 'info legend');
      let item = "";

      item += '<div id="LegendHeader" ><span><i class="fa fa-list"></i>Explanation</span></div>'+
        '<div id="legendDiv"><br>';
           item += '<i class="site multiple-types"></i>Multiple</div>';
           div.innerHTML = item;
           div.id = 'legend';

           L.DomEvent.on(div, 'click', (event) => {
            // if click is in Explanation title, collapse/expand it.
            const id = event.target['id'];
            if ('legendHeader') {
                const classes = document.getElementById('legendDiv').classList;
                if (classes.contains('legendDiv-collapsed')) {
                    classes.remove('legendDiv-collapsed');
                } else {
                    classes.add('legendDiv-collapsed');
                }
            }
          });
          return div;

        
    }

    this._mapService.legend.addTo(this._mapService.map);

    
    
     


    this._mapService.DataPanelCollapse.subscribe(collapse => {
      this.collapsedDataPanel = collapse;
    });

    
  
    //let usSites = this._mapService.getUSsiteData();

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
    }, 150);
  }

}
