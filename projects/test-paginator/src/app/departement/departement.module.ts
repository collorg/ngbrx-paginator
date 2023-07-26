import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromDepartement from './departement.reducer';
import { DepartementsComponent } from './departements/departements.component';
import { NgbrxPaginatorModule } from 'ngbrx-paginator';

@NgModule({
  declarations: [
    DepartementsComponent
  ],
  imports: [
    CommonModule,
    NgbrxPaginatorModule.forFeature({
      'Departement/Pagination': {
        filters: {
          'Nom': { filter: fromDepartement.byName },
          'Code': { filter: fromDepartement.byCode },
          'Régions/COM': { filter: fromDepartement.byRegion, values: fromDepartement.selectRegions }
        },
        allDataSelector: fromDepartement.selectAll,
        pageSizeOptions: [10, 20, 30]
      }
    }),
    StoreModule.forFeature(fromDepartement.departementsFeature),
  ],
  exports: [
    DepartementsComponent
  ]
})
export class DepartementModule { }
