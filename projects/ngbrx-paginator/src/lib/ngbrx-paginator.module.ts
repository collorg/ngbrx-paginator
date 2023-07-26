import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgbrxPaginatorComponent } from './ngbrx-paginator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store, StoreModule } from '@ngrx/store';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import * as fromPaginationState from './reducers';
import { NgbrxPaginatorActions } from './reducers/ngbrx-paginator.actions';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { NgbrxPaginatorService } from './ngbrx-paginator.service';
import { Paginators } from './ngbrx-paginator.model';
import { NgbrxPaginatorFilterDesc } from './ngbrx-paginator-filter-desc/ngbrx-paginator-filter-desc.component';
import { SearchIconComponent } from './search-icon/search-icon.component';
import { LockedComponent } from './locked/locked.component';
import { UnlockedComponent } from './unlocked/unlocked.component';

let paginators: Paginators = {};
const paginatorsSubject: BehaviorSubject<Paginators> = new BehaviorSubject<Paginators>(paginators);
const paginators$: Observable<Paginators> = paginatorsSubject.asObservable();

@NgModule({
  declarations: [
    NgbrxPaginatorComponent,
    NgbrxPaginatorFilterDesc,
    SearchIconComponent,
    LockedComponent,
    UnlockedComponent,
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

  static forFeature(options: Paginators): ModuleWithProviders<NgbrxPaginatorModule> {
    Array.prototype.push.apply(paginators, options.paginators);
    paginatorsSubject.next(paginators);
    return {
      ngModule: NgbrxPaginatorModule
    };
  }

  constructor(
    private store: Store,
  ) {
      paginators$.pipe(
        take(1)
      ).subscribe(
        (paginators: PaginatorParams<any>[]) => paginators.forEach((paginator: PaginatorParams<any>) => this.addFeature(paginator))
      )

  }

  addFeature(paginator: PaginatorParams<any>) {
    Object.keys(paginator).forEach((key: string) => {
      this.store.dispatch(NgbrxPaginatorActions.initPaginator({ paginator[key] }));
      NgbrxPaginatorService.add(paginator);
    })
  }

}
