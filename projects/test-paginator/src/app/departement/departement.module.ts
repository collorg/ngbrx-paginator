import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromDepartement from './departement.reducer';
import { DepartementsComponent } from './departements/departements.component';
import { NgbrxPaginatorModule } from 'ngbrx-paginator';
import { EffectsModule } from '@ngrx/effects';
import { PaginationEffects } from './pagination.effects';

@NgModule({
  declarations: [
    DepartementsComponent
  ],
  imports: [
    CommonModule,
    NgbrxPaginatorModule,
    StoreModule.forFeature(fromDepartement.departementsFeature),
    EffectsModule.forFeature(PaginationEffects)
  ],
  exports: [
    DepartementsComponent
  ]
})
export class DepartementModule { }
