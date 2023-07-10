import { Injectable } from '@angular/core';
import { Store, Selector } from '@ngrx/store';

import * as fromStore from './reducers';
import { NgbrxPaginatorActions } from './reducers/ngbrx-paginator.actions';
import { Observable, take } from 'rxjs';


export interface FilterFunction<D> {
  (items: D[], query: string): D[];
}

export interface Features {
  [key: string]: {
    filters: FilterFunction<any>,
    allDataSelector: Selector<object, any[]>
  }
}


@Injectable({
  providedIn: 'root'
})
export class NgbrxPaginatorService {
  static features: Features = {};

  constructor(
    private store: Store
  ) {
  }

  static add(key: string, filters: FilterFunction<any>, allDataSelector: Selector<object, any[]>) {
    NgbrxPaginatorService.features[key] = { filters, allDataSelector };
  }

  hasFilter(key: string) {
    return NgbrxPaginatorService.features[key].filters !== null;
  }

  getPageItems$<M>(key: string): Observable<M[]> {
    return this.store.select(fromStore.selectPageItems<M>(key));
  }

  filterValue$(key: string): Observable<string> {
    return this.store.select(fromStore.selectFilterValue(key));
  }

  numberOfFilteredItems$(key: string): Observable<number> {
    return this.store.select(fromStore.selectNumberOfFilteredItems(key));
  }

  filteredCollection$<M>(key: string): Observable<M> {
    return this.store.select<M>(fromStore.selectFilteredCollection(key));
  }

  pagination$(key: string): Observable<fromStore.Pagination> {
    return this.store.select(fromStore.selectPagination(key));
  }

  pagesCount$(key: string): Observable<number> {
    return this.store.select(fromStore.selectPagesCount(key));
  }

  setPage(key: string, page: number): number {
    this.store.dispatch(NgbrxPaginatorActions.setPage({key, page}));
    return page;
  }

  setPageSize(key: string, pageSize: number) {
    this.store.dispatch(NgbrxPaginatorActions.setPageSize({key, pageSize}));
  }

  setPageSizeOptions(key: string, pageSizeOptions: number[]) {
    this.store.dispatch(NgbrxPaginatorActions.setPageSizeOptions({key, pageSizeOptions}));
  }

  setFilterQuery(key: string, filter: string) {
    this.store.dispatch(NgbrxPaginatorActions.setFilterQuery({key, filter}));
  }

}
