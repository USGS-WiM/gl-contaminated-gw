import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DataviewComponent } from './dataview/dataview.component';




@NgModule({
  declarations: [MapComponent, SidebarComponent, DataviewComponent],
  imports: [CommonModule],
  exports: [MapComponent, SidebarComponent, DataviewComponent]
})
export class MainviewModule { }
