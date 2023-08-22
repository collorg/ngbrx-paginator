import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgbrxPaginatorComponent } from './ngbrx-paginator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import * as fromPaginationState from './reducers';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { NgbrxPaginatorService } from './ngbrx-paginator.service';
import { Paginators } from './ngbrx-paginator.model';
import { NgbrxPaginatorFilterDesc } from './ngbrx-paginator-filter-desc/ngbrx-paginator-filter-desc.component';
import { SearchIconComponent } from './search-icon/search-icon.component';
import { LockedComponent } from './locked/locked.component';
import { UnlockedComponent } from './unlocked/unlocked.component';
import { NgbrxPaginatorFilterSelectorComponent } from './ngbrx-paginator-filter-selector/ngbrx-paginator-filter-selector.component';

let paginators: Paginators<any> = {};
const paginatorsSubject: BehaviorSubject<Paginators<any>> = new BehaviorSubject<Paginators<any>>(paginators);
const paginators$: Observable<Paginators<any>> = paginatorsSubject.asObservable();

@NgModule({
  declarations: [
    NgbrxPaginatorComponent,
    NgbrxPaginatorFilterDesc,
    SearchIconComponent,
    LockedComponent,
    UnlockedComponent,
    NgbrxPaginatorFilterSelectorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    StoreModule.forFeature(fromPaginationState.paginationStateFeatureKey, fromPaginationState.reducers)
  ],
  exports: [
    NgbrxPaginatorComponent,
    NgbrxPaginatorFilterDesc
  ]
})
export class NgbrxPaginatorModule {
  static forRoot(): ModuleWithProviders<NgbrxPaginatorModule> {
    return {
      ngModule: NgbrxPaginatorModule,
    };
  }

  static forFeature(options: Paginators<any>): ModuleWithProviders<NgbrxPaginatorModule> {
    Object.assign(paginators, options);
    paginatorsSubject.next(paginators);
    return {
      ngModule: NgbrxPaginatorModule
    };
  }

  constructor(private service: NgbrxPaginatorService) {
    paginators$.pipe(take(1)).subscribe(
      (paginators: Paginators<any>) => this.service.initPaginators(paginators)
    )
  }

}
