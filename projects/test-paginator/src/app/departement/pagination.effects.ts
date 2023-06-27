import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { switchMap, tap } from 'rxjs';

import * as fromStore from './departement.reducer';

import { DepartementActions } from './departement.actions';
import { Departement } from './departement.model';



@Injectable()
export class PaginationEffects {

  filterCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartementActions.filterCollection),
      tap((action) => {
        this.store.dispatch(DepartementActions.setFilterQuery({ filter: action.filter }));
        this.store.dispatch(DepartementActions.setPage({ page: 1 }));
      }),
      switchMap(() => this.store.pipe<Departement[]>(select(fromStore.selectFilteredCollection))),
      tap((collection: Departement[]) => {
        this.store.dispatch(DepartementActions.setFilteredCollectionSize({ size: collection.length }));
        return [];
      })
    ), { dispatch: false });


  constructor(
    private actions$: Actions,
    private store: Store
  ) { }
}
