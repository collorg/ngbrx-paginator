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
          'Code': fromCommune.byCode,
          'Name': fromCommune.byName,
          'Population >': fromCommune.byPopulationGreaterThan,
          'Population <': fromCommune.byPopulationLesserThan
        },
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
