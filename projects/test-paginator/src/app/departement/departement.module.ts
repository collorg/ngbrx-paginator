import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromDepartement from './departement.reducer';
import { DepartementsComponent } from './departements/departements.component';



@NgModule({
  declarations: [
    DepartementsComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromDepartement.departementsFeatureKey, fromDepartement.reducer)
  ]
})
export class DepartementModule { }
