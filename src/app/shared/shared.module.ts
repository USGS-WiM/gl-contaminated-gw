import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabComponent } from './components/tab/tab.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderService } from './services/loader.service';
import { DataLoaderComponent } from './components/loader/dataloader.component';


@NgModule({
    declarations: [TabsComponent, TabComponent, LoaderComponent, DataLoaderComponent],
    imports: [CommonModule],
    exports: [TabsComponent, TabComponent, LoaderComponent, DataLoaderComponent],
    providers: [LoaderService]
})
export class SharedModule {}
