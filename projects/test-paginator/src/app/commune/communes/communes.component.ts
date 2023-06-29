import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { PaginationActions } from '../commune.actions';
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
  actions = PaginationActions;
  collection$: Observable<Commune[]> = this.store.select(fromStore.selectFilteredCollection);
  pagination$: Observable<Pagination> = this.store.select(fromStore.selectedPagination);

  pageItems$: Observable<Commune[]> = this.store.select(fromStore.selectPageItems);

  constructor(
    private store: Store
  ) { }
}
