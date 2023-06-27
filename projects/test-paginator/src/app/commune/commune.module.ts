import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromCommune from './commune.reducer';
import { CommunesComponent } from './communes/communes.component';
import { NgbrxPaginatorModule } from 'ngbrx-paginator';
import { EffectsModule } from '@ngrx/effects';
import { PaginationEffects } from './pagination.effects';

@NgModule({
  declarations: [
    CommunesComponent
  ],
  imports: [
    CommonModule,
    NgbrxPaginatorModule,
    StoreModule.forFeature(fromCommune.communesFeature),
    EffectsModule.forFeature(PaginationEffects)
  ],
  exports: [
    CommunesComponent
  ]
})
export class CommuneModule { }
