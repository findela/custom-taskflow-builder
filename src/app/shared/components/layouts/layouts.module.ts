import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlankLayoutComponent } from './blank-layout/blank-layout.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

const components = [
  BlankLayoutComponent
];

@NgModule({
  imports: [
    RouterModule,
    FormsModule,
    CommonModule
  ],
  declarations: components,
  exports: components
})
export class LayoutsModule { }
