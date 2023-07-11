import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromCommune from './commune.reducer';
import { CommunesComponent } from './communes/communes.component';
import { NgbrxPaginatorModule } from 'ngbrx-paginator';
import { CommuneRoutingModule } from './commune-routing.module';

@NgModule({
  declarations: [
    CommunesComponent
  ],
  imports: [
    CommonModule,
    NgbrxPaginatorModule.forFeature({
      paginators: [{
        key: 'Commune/Pagination',
        filters: {
          'by code': fromCommune.byCode,
          'by name': fromCommune.byName,
        },
        filter: fromCommune.byCode,
        allDataSelector: fromCommune.selectAll
      }]
    }),
    StoreModule.forFeature(fromCommune.communesFeature),
    CommuneRoutingModule
  ],
  exports: [
    CommunesComponent
  ]
})
export class CommuneModule { }
