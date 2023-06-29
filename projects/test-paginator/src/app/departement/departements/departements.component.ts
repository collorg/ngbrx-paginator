import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { PaginationActions } from '../departement.actions';
import { Observable } from 'rxjs';
import { Departement } from '../departement.model';
import * as fromStore from '../departement.reducer';
import { Pagination } from 'ngbrx-paginator';

@Component({
  selector: 'app-departements',
  templateUrl: './departements.component.html',
  styleUrls: ['./departements.component.css']
})
export class DepartementsComponent {
  actions = PaginationActions;
  collection$: Observable<Departement[]> = this.store.select(fromStore.selectFilteredCollection);
  pagination$: Observable<Pagination> = this.store.select(fromStore.selectedPagination);

  pageItems$: Observable<Departement[]> = this.store.select(fromStore.selectPageItems);

  constructor(
    private store: Store
  ) { }
}
