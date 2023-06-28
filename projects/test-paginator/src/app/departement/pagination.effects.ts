import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { switchMap, tap } from 'rxjs';

import * as fromStore from './departement.reducer';

import { PaginationActions } from './departement.actions';
import { Departement } from './departement.model';



@Injectable()
export class PaginationEffects {

  filterCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaginationActions.filterCollection),
      tap((action) => {
        this.store.dispatch(PaginationActions.setFilterQuery({ filter: action.filter }));
        this.store.dispatch(PaginationActions.setPage({ page: 1 }));
      }),
      switchMap(() => this.store.pipe<Departement[]>(select(fromStore.selectFilteredCollection))),
      tap((collection: Departement[]) => {
        this.store.dispatch(PaginationActions.setFilteredCollectionSize({ size: collection.length }));
        return [];
      })
    ), { dispatch: false });


  constructor(
    private actions$: Actions,
    private store: Store
  ) { }
}
