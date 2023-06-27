import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DepartementActions } from '../departement.actions';
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
  actions = DepartementActions;
  collection$: Observable<Departement[]> = this.store.select(fromStore.selectFilteredCollection);
  pageItems$: Observable<Departement[]> = this.store.select(fromStore.selectPageItems);
  pagination$: Observable<Pagination> = this.store.select(fromStore.selectedPagination);
  usersLength$: Observable<number> = this.store.select(fromStore.departementsFeature.selectTotal);
  filterValue$: Observable<string> = this.store.select(fromStore.selectFilterValue);

  constructor(
    private store: Store
  ) { }
}
