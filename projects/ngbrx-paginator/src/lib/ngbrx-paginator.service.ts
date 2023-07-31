import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from './reducers';
import { NgbrxPaginatorActions } from './reducers/ngbrx-paginator.actions';
import { EMPTY, Observable } from 'rxjs';
import { Pagination, Paginators, SPaginators } from './ngbrx-paginator.model';

const sp = new SPaginators();

@Injectable({
  providedIn: 'root'
})
export class NgbrxPaginatorService {

  constructor(
    private store: Store
  ) {
  }

  initPaginators(paginators: Paginators<any>) {
    sp.paginators = paginators;
    Object.keys(paginators).forEach((key) => 
    this.store.dispatch(NgbrxPaginatorActions.initPaginator({key, paginator: paginators[key]}))
    )
  }

  static get paginators() {
    return sp.paginators
  }

  getFilterValues$(paginatorKey: string, filterKey: string): Observable<any> {
    if (!sp.paginators) {
      return EMPTY;
    }
    const values = sp.paginators[paginatorKey].filters[filterKey].values;
    if (values) {
      return this.store.select(values);
    }
    return EMPTY;
  }

  hasFilter(key: string): boolean {
    if (sp.paginators[key]) {
      return !!sp.paginators[key].filters;
    }
    return false;
  }

  getPageItems$<M>(key: string): Observable<M[]> {
    return this.store.select(fromStore.selectPageItems<M>(key));
  }

  filters$(key: string): Observable<string[]> {
    return this.store.select(fromStore.selectFilters(key));
  }

  currentFilter$(key: string): Observable<number> {
    return this.store.select(fromStore.selectCurrentFilter(key));
  }

  filterQueries$(key: string): Observable<string[]> {
    return this.store.select(fromStore.selectFilterQueries(key));
  }

  selectedFilters$(key: string): Observable<number[]> {
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

  pagination$(key: string): Observable<Pagination> {
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

  setCurrentFilter(key: string, filterIdx: number) {
    this.store.dispatch(NgbrxPaginatorActions.setCurrentFilter({ key, filterIdx }))
  }

  setFilterQuery(key: string, filterQuery: string) {
    this.store.dispatch(NgbrxPaginatorActions.setFilterQuery({ key, filterQuery }));
  }

  selectFilter(key: string, filterIdx: number) {
    this.store.dispatch(NgbrxPaginatorActions.selectFilter({ key, filterIdx }))
  }

  unselectFilter(key: string, filterIdx: number) {
    this.store.dispatch(NgbrxPaginatorActions.unselectFilter({ key, filterIdx }))
  }

}
