import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mainview-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  expandSidebar;
  showBasemaps;
  chosenBaseLayer;
  showSection2;
  toggleLayer;

  constructor() { }

  ngOnInit() {
  }

}
