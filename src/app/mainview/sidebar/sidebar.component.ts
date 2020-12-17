import { Component, OnInit, Directive, Input } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MapService } from "src/app/shared/services/map.service";
import { ConvertPropertyBindingResult } from "@angular/compiler/src/compiler_util/expression_converter";
import { PromiseType } from "protractor/built/plugins";
import { BoundDirectivePropertyAst } from "@angular/compiler";

@Component({
  selector: "app-mainview-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  siteFilterFormGroup: FormGroup;
  siteFilterData;
  filterSelections;
  filterOptions = ["EPA Region", "Site Type"];
  expandSidebar;
  showBasemaps;
  showAuxLayers;
  chosenBaseLayer;
  showSection2;
  displayedAuxLayers;
  profileForm: FormGroup;

  constructor(
    private _mapService: MapService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.displayedAuxLayers = this._mapService.defaultAuxLayers;

    /*     this.profileForm = this._formBuilder.group({
      firstName: [''],
      lastName: [''],
    }) */
    this.siteFilterData = ["a", "b"];
    this.siteFilterFormGroup = this._formBuilder.group({
      //epa region location
      location: [[]],
      //map symbol code
      siteType: [[]],
      //orgName: [[]],
      //provider: [[]],
      //searchType: [[]],
      //type: [[]]
    });

    /*     this._mapService.getUSsiteData().subscribe(response =>{
      this.siteFilterData = response;
    }) */

    // this.onChanges();
  }
  // called from basemap button click in sidebar
  public toggleLayer(newVal: string) {
    this._mapService.chosenBaseLayer = newVal;
    this._mapService.map.removeLayer(
      this._mapService.baseMaps["OpenStreetMap"]
    );
    this._mapService.map.removeLayer(this._mapService.baseMaps["Topo"]);
    this._mapService.map.removeLayer(this._mapService.baseMaps["Terrain"]);
    this._mapService.map.removeLayer(this._mapService.baseMaps["Satellite"]);
    this._mapService.map.removeLayer(this._mapService.baseMaps["Gray"]);
    this._mapService.map.removeLayer(this._mapService.baseMaps["Nautical"]);
    this._mapService.map.addLayer(this._mapService.baseMaps[newVal]);
  }

  public toggleAuxLayer(newVal: string) {
    let index = this.displayedAuxLayers.indexOf(newVal);
    if (index == -1) {
      this.displayedAuxLayers.push(newVal);
      this._mapService.map.addLayer(this._mapService.auxLayers[newVal]);
    } else {
      this.displayedAuxLayers.splice(index, 1);
      this._mapService.map.removeLayer(this._mapService.auxLayers[newVal]);
    }
  }

  // public onChanges(): void {
  //   this.siteFilterFormGroup.valueChanges.subscribe(selections => {
  //     this.filterSelections = selections;
  //   });
  // }
}
