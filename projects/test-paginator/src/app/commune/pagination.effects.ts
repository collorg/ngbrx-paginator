import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { switchMap, tap } from 'rxjs';

import * as fromStore from './commune.reducer';

import { PaginationActions } from './commune.actions';
import { Commune } from './commune.model';
import * as paginator from 'ngbrx-paginator';



@Injectable()
export class PaginationEffects {

  filterCollection$ = paginator.createFilterEffect<Commune>(this.actions$, this.store, PaginationActions, fromStore.selectFilteredCollection);
  constructor(
    private actions$: Actions,
    private store: Store
  ) { }
}
