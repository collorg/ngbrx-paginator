import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromCommune from './commune.reducer';
import { CommunesComponent } from './communes/communes.component';
import { NgbrxPaginatorModule } from 'ngbrx-paginator'; 

@NgModule({
  declarations: [
    CommunesComponent
  ],
  imports: [
    CommonModule,
    NgbrxPaginatorModule.forFeature({
      featureKey: 'Commune/Pagination',
      filterFunction: fromCommune.filterFunction,
      allDataSelector: fromCommune.selectAll
    }),
    StoreModule.forFeature(fromCommune.communesFeature),
  ],
  exports: [
    CommunesComponent
  ]
})
export class CommuneModule { }
