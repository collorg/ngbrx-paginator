import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from './departement.reducer';
import { DepartementActions } from './departement.actions';
import { departements } from '../data/departements';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  isLoaded = false;
  constructor(
    private store: Store<fromStore.State>
  ) {
  }

  load() {
    if (!this.isLoaded) {
      this.store.dispatch(DepartementActions.loadDepartements({ departements }));
      this.isLoaded = true;
    }
  }

}
