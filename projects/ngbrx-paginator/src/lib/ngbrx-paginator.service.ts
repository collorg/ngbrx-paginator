import { Injectable } from '@angular/core';
import { Store, Selector } from '@ngrx/store';

import * as fromStore from './reducers';
import { NgbrxPaginatorActions } from './reducers/ngbrx-paginator.actions';
import { Observable } from 'rxjs';
import { Features, FilterFunction, FilterFunctions } from './ngbrx-paginator.model';


@Injectable({
  providedIn: 'root'
})
export class NgbrxPaginatorService {
  static features: Features = {};

  constructor(
    private store: Store
  ) {
  }

  static add(key: string, allDataSelector: Selector<object, any[]>, filters: FilterFunctions<any>) {
    NgbrxPaginatorService.features[key] = { allDataSelector, filters };
  }

  setCurrent(paginatorKey: string) {
    this.store.dispatch(NgbrxPaginatorActions.setCurrentPaginator({ paginatorKey }));
  }

  hasFilter(key: string) {
    return !!NgbrxPaginatorService.features[key].filters;
  }

  getPageItems$<M>(key: string): Observable<M[]> {
    return this.store.select(fromStore.selectPageItems<M>(key));
  }

  filterQuery$(key: string): Observable<string> {
    return this.store.select(fromStore.selectFilterQuery(key));
  }

  currentFilter$(key: string): Observable<string> {
    return this.store.select(fromStore.selectCurrentFilter(key));
  }

  filterQueries$(key: string): Observable<{ [key: string]: string }> {
    return this.store.select(fromStore.selectFilterQueries(key));
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
    this.store.dispatch(NgbrxPaginatorActions.setPage({ key, page }));
    return page;
  }

  setPageSize(key: string, pageSize: number) {
    this.store.dispatch(NgbrxPaginatorActions.setPageSize({ key, pageSize }));
  }

  setPageSizeOptions(key: string, pageSizeOptions: number[]) {
    this.store.dispatch(NgbrxPaginatorActions.setPageSizeOptions({ key, pageSizeOptions }));
  }

  setCurrentFilter(key: string, filterKey: string) {
    this.store.dispatch(NgbrxPaginatorActions.setCurrentFilter({ key, filterKey }))
  }

  setFilterQuery(key: string, filterQuery: string) {
    this.store.dispatch(NgbrxPaginatorActions.setFilterQuery({ key, filterQuery }));
  }

}
