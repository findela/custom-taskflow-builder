import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TaskflowRoutingModule } from './taskflow-routing.module';
import { BuilderComponent } from './builder/builder.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PropertyComponent } from './property/property.component';
import { BlockComponent } from './block/block.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { HeaderComponent } from './header/header.component';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SidebarModule } from 'ng-sidebar';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  entryComponents: [],
  declarations: [BuilderComponent, PropertyComponent, BlockComponent, HeaderComponent],
  providers: [],
  imports: [
    CommonModule,
    NgxGraphModule,
    NgxChartsModule,
    FormsModule,
    TaskflowRoutingModule,
    NgxJsonViewerModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    PopoverModule.forRoot(),
    SidebarModule
  ],
  exports: []
})
export class TaskflowModule { }
