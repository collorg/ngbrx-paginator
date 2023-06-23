import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { switchMap, tap } from 'rxjs';

import * as fromStore from './departement.reducer';

import { DepartementActions } from './departement.actions';



@Injectable()
export class FilterCollectionEffects {

  filterCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartementActions.filterCollection),
      tap((action) => {
        this.store.dispatch(DepartementActions.storeFilterQuery({ filter: action.filter }));
        this.store.dispatch(DepartementActions.setPage({ page: 1 }));
      }),
      switchMap(() => this.store.pipe(select(fromStore.selectFilteredCollection))),
      switchMap((collection) => {
        this.store.dispatch(DepartementActions.setFilteredCollectionSize({ size: collection.length }));
        return [];
      })
    ), { dispatch: false });


  constructor(
    private actions$: Actions,
    private store: Store
  ) { }
}
