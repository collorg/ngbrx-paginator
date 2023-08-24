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
      'Commune/Pagination': {
        filters: {
          'Code': { filter: fromCommune.byCode },
          'Nom': { filter: fromCommune.byName },
          'Population >': { filter: fromCommune.byPopulationGreaterThan, inactivate: true },
          'Population <': { filter: fromCommune.byPopulationLesserThan, inactivate: true }
        },
        allDataSelector: fromCommune.selectAll
      }
    }),
    StoreModule.forFeature(fromCommune.communesFeature),
    CommuneRoutingModule
  ],
  exports: [
    CommunesComponent
  ]
})
export class CommuneModule { }
