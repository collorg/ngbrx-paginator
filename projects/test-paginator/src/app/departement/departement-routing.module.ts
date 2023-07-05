import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartementsComponent } from './departements/departements.component';

const routes: Routes = [

  { path: '', component: DepartementsComponent },

];

@NgModule({
  imports: [RouterModule.forFeature(routes)],
  exports: [RouterModule]
})
export class DepartementRoutingModule { }
