import { Injectable } from '@angular/core';
import { MemoizedSelector, Store } from '@ngrx/store';

import * as fromStore from './reducers';
import { NgbrxPaginatorActions } from './reducers/ngbrx-paginator.actions';
import { EMPTY, Observable, filter } from 'rxjs';
import { Paginators } from './ngbrx-paginator.model';


@Injectable({
  providedIn: 'root'
})
export class NgbrxPaginatorService {
  static paginators: Paginators = {};

  constructor(
    private store: Store
  ) {
  }

  static add(paginator: PaginatorParams<any>) {
    NgbrxPaginatorService.paginators[paginator.key] = { allDataSelector: paginator.allDataSelector, filters: paginator.filters };
  }

  setCurrent(paginatorKey: string) {
    this.store.dispatch(NgbrxPaginatorActions.setCurrentPaginator({ paginatorKey }));
  }

  getFilterValues$(paginatorKey: string, filterKey: string): Observable<any> {
    const values = NgbrxPaginatorService.paginators[paginatorKey].filters[filterKey].values;
    if (values) {
      return this.store.select(values);
    }
    return EMPTY;
  }

  hasFilter(key: string) {
    return !!NgbrxPaginatorService.paginators[key].filters;
  }

  getPageItems$<M>(key: string): Observable<M[]> {
    return this.store.select(fromStore.selectPageItems<M>(key));
  }

  currentFilter$(key: string): Observable<string> {
    return this.store.select(fromStore.selectCurrentFilter(key));
  }

  filterQueries$(key: string): Observable<{ [key: string]: string }> {
    return this.store.select(fromStore.selectFilterQueries(key));
  }

  selectedFilters$(key: string): Observable<string[]> {
    return this.store.select(fromStore.selectSelectedFilters(key));
  }

  currentFiltersDesc$(key: string): Observable<string> {
    return this.store.select(fromStore.selectCurrentFilterDesc(key))
  }

  numberOfFilteredItems$(key: string): Observable<number> {
    return this.store.select(fromStore.selectNumberOfFilteredItems(key));
  }

  filteredCollection$<M>(key: string): Observable<M> {
    return this.store.select<M>(fromStore.selectFilteredCollection(key));
  }

  pagination$(key: string): Observable<fromStore.Pagination> {
    return this.store.select(fromStore.SelectPagination(key));
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

  selectFilter(key: string, filterKey: string) {
    this.store.dispatch(NgbrxPaginatorActions.selectFilter({ key, filterKey }))
  }

  unselectFilter(key: string, filterKey: string) {
    this.store.dispatch(NgbrxPaginatorActions.unselectFilter({ key, filterKey }))
  }

}
