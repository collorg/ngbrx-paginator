import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from './commune.reducer';
import { CommuneActions } from './commune.actions';
import { communes } from '../data/communes';

@Injectable({
  providedIn: 'root'
})
export class CommuneService {
  isLoaded = false;
  constructor(
    private store: Store<fromStore.State>
  ) { }

  load() {
    if (!this.isLoaded) {
      this.store.dispatch(CommuneActions.loadCommunes({communes}));
      this.isLoaded = true
    }
  }

}
