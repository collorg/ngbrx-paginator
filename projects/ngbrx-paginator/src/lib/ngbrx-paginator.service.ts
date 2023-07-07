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
    filterFunction: FilterFunction<any>,
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

  static add(featureKey: string, filterFunction: FilterFunction<any>, allDataSelector: Selector<object, any[]>) {
    NgbrxPaginatorService.features[featureKey] = { filterFunction, allDataSelector };
  }

  hasFilter(featureKey: string) {
    return NgbrxPaginatorService.features[featureKey].filterFunction !== null;
  }

  getPageItems$<M>(featureKey: string): Observable<M[]> {
    return this.store.select(fromStore.selectPageItems<M>(featureKey));
  }

  filterValue$(featureKey: string): Observable<string> {
    return this.store.select(fromStore.selectFilterValue(featureKey));
  }

  numberOfFilteredItems$(featureKey: string): Observable<number> {
    return this.store.select(fromStore.selectNumberOfFilteredItems(featureKey));
  }

  filteredCollection$<M>(featureKey: string): Observable<M> {
    return this.store.select<M>(fromStore.selectFilteredCollection(featureKey));
  }

  pagination$(featureKey: string): Observable<fromStore.Pagination> {
    return this.store.select(fromStore.selectPagination(featureKey));
  }

  pagesCount$(featureKey: string): Observable<number> {
    return this.store.select(fromStore.selectPagesCount(featureKey));
  }

  setPage(featureKey: string, page: number): number {
    this.store.dispatch(NgbrxPaginatorActions.setPage({featureKey, page}));
    return page;
  }

  setPageSize(featureKey: string, pageSize: number) {
    this.store.dispatch(NgbrxPaginatorActions.setPageSize({featureKey, pageSize}));
  }

  setPageSizeOptions(featureKey: string, pageSizeOptions: number[]) {
    this.store.dispatch(NgbrxPaginatorActions.setPageSizeOptions({featureKey, pageSizeOptions}));
  }

  setFilterQuery(featureKey: string, filter: string) {
    this.store.dispatch(NgbrxPaginatorActions.setFilterQuery({featureKey, filter}));
  }

}
