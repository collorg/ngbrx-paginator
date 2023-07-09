import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { NgbrxPaginatorComponent } from './ngbrx-paginator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Selector, Store, StoreModule } from '@ngrx/store';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import * as fromPaginationState from './reducers';
import { NgbrxPaginatorActions } from './reducers/ngbrx-paginator.actions';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { NgbrxPaginatorService } from './ngbrx-paginator.service';

interface PaginatorParams {
  featureKey?: string,
  filterFunction?: any,
  allDataSelector: Selector<object, any[]>,
  pageSizeOptions?: number[]
}

interface ModuleParams {
  paginators: PaginatorParams[]
}

let paginators: PaginatorParams[] = [];
const paginatorsSubject: BehaviorSubject<PaginatorParams[]> = new BehaviorSubject<PaginatorParams[]>(paginators);
const paginators$: Observable<PaginatorParams[]> = paginatorsSubject.asObservable();

@NgModule({
  declarations: [
    NgbrxPaginatorComponent
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
    NgbrxPaginatorComponent
  ]
})
export class NgbrxPaginatorModule {
  static forRoot(): ModuleWithProviders<NgbrxPaginatorModule> {
    return {
      ngModule: NgbrxPaginatorModule,
    };
  }

  static forFeature(options: ModuleParams): ModuleWithProviders<NgbrxPaginatorModule> {
    Array.prototype.push.apply(paginators, options.paginators);
    paginatorsSubject.next(paginators);
    return {
      ngModule: NgbrxPaginatorModule,
      providers: [
        { provide: 'PAGINATORS', useValue: options.paginators },
      ]
    };
  }

  constructor(
    private store: Store,
  ) {
      paginators$.pipe(
        take(1)
      ).subscribe(
        (paginators: PaginatorParams[]) => paginators.forEach((paginator: PaginatorParams) => this.addFeature(paginator))
      )

  }

  addFeature(paginator: PaginatorParams) {
    if (paginator.featureKey) {
      this.store.dispatch(NgbrxPaginatorActions.initFeature({ featureKey: paginator.featureKey, pageSizeOptions: paginator.pageSizeOptions }));
      if (paginator.filterFunction) {
        NgbrxPaginatorService.add(paginator.featureKey, paginator.filterFunction, paginator.allDataSelector);
      }
    }
  }

}
