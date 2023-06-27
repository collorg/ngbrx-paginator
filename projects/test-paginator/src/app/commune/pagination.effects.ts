import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { switchMap, tap } from 'rxjs';

import * as fromStore from './commune.reducer';

import { CommuneActions } from './commune.actions';
import { Commune } from './commune.model';



@Injectable()
export class PaginationEffects {

  filterCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommuneActions.filterCollection),
      tap((action) => {
        this.store.dispatch(CommuneActions.setFilterQuery({ filter: action.filter }));
        this.store.dispatch(CommuneActions.setPage({ page: 1 }));
      }),
      switchMap(() => this.store.pipe<Commune[]>(select(fromStore.selectFilteredCollection))),
      tap((collection: Commune[]) => {
        this.store.dispatch(CommuneActions.setFilteredCollectionSize({ size: collection.length }));
        return [];
      })
    ), { dispatch: false });


  constructor(
    private actions$: Actions,
    private store: Store
  ) { }
}
