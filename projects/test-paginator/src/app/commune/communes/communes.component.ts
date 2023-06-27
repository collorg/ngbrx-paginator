import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommuneActions } from '../commune.actions';
import { Observable } from 'rxjs';
import { Commune } from '../commune.model';
import * as fromStore from '../commune.reducer';
import { Pagination } from 'ngbrx-paginator';

@Component({
  selector: 'app-communes',
  templateUrl: './communes.component.html',
  styleUrls: ['./communes.component.css']
})
export class CommunesComponent {
  actions = CommuneActions;
  collection$: Observable<Commune[]> = this.store.select(fromStore.selectFilteredCollection);
  pageItems$: Observable<Commune[]> = this.store.select(fromStore.selectPageItems);
  pagination$: Observable<Pagination> = this.store.select(fromStore.selectedPagination);
  usersLength$: Observable<number> = this.store.select(fromStore.communesFeature.selectTotal);
  filterValue$: Observable<string> = this.store.select(fromStore.selectFilterValue);

  constructor(
    private store: Store
  ) { }
}
