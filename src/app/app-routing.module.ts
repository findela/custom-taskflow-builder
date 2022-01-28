import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlankLayoutComponent } from './shared/components/layouts/blank-layout/blank-layout.component';
import { TaskflowModule } from "./views/taskflow/taskflow.module";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'taskflow/builder',
    pathMatch: 'full'
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'taskflow',
        loadChildren: () => TaskflowModule
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
