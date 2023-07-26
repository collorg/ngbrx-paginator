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
import { Paginator, Paginators } from './ngbrx-paginator.model';
import { NgbrxPaginatorFilterDesc } from './ngbrx-paginator-filter-desc/ngbrx-paginator-filter-desc.component';
import { SearchIconComponent } from './search-icon/search-icon.component';
import { LockedComponent } from './locked/locked.component';
import { UnlockedComponent } from './unlocked/unlocked.component';

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

  constructor(
    private store: Store,
  ) {
    paginators$.pipe(
      take(1)
    ).subscribe(
      (paginators: Paginators<any>) => Object.keys(paginators).forEach((key: string) => this.addFeature(key, paginators[key]))
    )

  }

  addFeature(key: string, paginator: Paginator<any>) {
    this.store.dispatch(NgbrxPaginatorActions.initPaginator({ key, paginator }));
    NgbrxPaginatorService.add(key, paginator);
  }

}
