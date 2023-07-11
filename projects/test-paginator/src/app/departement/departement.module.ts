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
      paginators: [{
        key: 'Departement/Pagination',
        filters: {
          'By name': fromDepartement.byName,
          'By code': fromDepartement.byCode,
          'By region': fromDepartement.byRegion
        },
        allDataSelector: fromDepartement.selectAll,
        pageSizeOptions: [10, 20, 30]
      }]
    }),
    StoreModule.forFeature(fromDepartement.departementsFeature),
  ],
  exports: [
    DepartementsComponent
  ]
})
export class DepartementModule { }
