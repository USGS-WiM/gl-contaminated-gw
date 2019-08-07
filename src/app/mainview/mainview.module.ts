import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapModule } from './map/map.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { DataviewModule } from './dataview/dataview.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MapModule,
    SidebarModule,
    DataviewModule,
  ]
})
export class MainviewModule { }
