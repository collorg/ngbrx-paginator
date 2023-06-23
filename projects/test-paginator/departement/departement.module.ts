import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromDepartement from '../src/app/departement/departement.reducer';
import { DepartementsComponent } from '../src/app/departement/departements/departements.component';

@NgModule({
  declarations: [
    DepartementsComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromDepartement.departementsFeature)
  ],
  exports: [
    DepartementsComponent
  ]
})
export class DepartementModule { }
