import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from './reducers';
import { NgbrxPaginatorActions } from './reducers/ngbrx-paginator.actions';
import { EMPTY, Observable, filter, map, mergeMap } from 'rxjs';
import { Pagination, Paginators, SPaginators } from './ngbrx-paginator.model';

const sp = new SPaginators();
export const previousState: { [key: string]: Pagination } | null = getLocalStorage();

function getLocalStorage(): { [key: string]: Pagination } | null {
  const ls = window.localStorage.getItem('ngbrx-paginator');
  if (ls) {
    return JSON.parse(ls)
  }
  return null;
}

@Injectable({
  providedIn: 'root'
})
export class NgbrxPaginatorService {
  dejaVu: string[] = [];
  constructor(private store: Store) {
  }


  initPaginators(paginators: Paginators<any>) {
    sp.paginators = paginators;
    // Object.keys(paginators).forEach((key) => {
    //   if (this.dejaVu.indexOf(key) === -1) { // && paginators[key].multi !== true) {
    //     this.store.dispatch(NgbrxPaginatorActions.initPaginator({ key, paginator: paginators[key] }));
    //     this.dejaVu.push(key);
    //   }
    // })
  }

  getKey(key: string, suffix?: string) {
    if (!suffix) {
      return key;
    }
    return `${key}-${suffix}`
  }

  initPaginator(key: string, suffix?: string) {
    const paginator = sp.paginators[key];
    key = this.getKey(key, suffix);
    if (this.dejaVu.indexOf(key) === -1) {
      this.store.dispatch(NgbrxPaginatorActions.initPaginator({ key, paginator }));
      this.dejaVu.push(key);
    }
  }

  static get paginators() {
    return sp.paginators
  }

  get paginatorKeys$(): Observable<string[]> {
    return this.store.select(fromStore.selectPaginatorKeys)
  }

  getFilterValues$(paginationKey: string, filterKey: string): Observable<any> {
    if (!sp.paginators || !sp.paginators[paginationKey] || !sp.paginators[paginationKey].filters || !sp.paginators[paginationKey].filters[filterKey]) {
      return EMPTY;
    }
    const values = sp.paginators[paginationKey].filters[filterKey].values;
    if (values) {
      return this.store.select(values);
    }
    return EMPTY;
  }

  hasFilter(key: string, suffix?: string): boolean {
    if (sp.paginators[key]) {
      return !!sp.paginators[key].filters;
    }
    return false;
  }

  getPageItems$<M>(key: string, suffix?: string): Observable<M[]> {
    return this.store.select(fromStore.selectPageItems<M>(key));
  }

  filters$(key: string, suffix?: string): Observable<string[]> {
    return this.store.select(fromStore.selectFilters(key));
  }

  activatedFilters$(key: string, suffix?: string): Observable<number[]> {
    return this.store.select(fromStore.selectActivatedFilters(key));
  }

  currentFilter$(key: string, suffix?: string): Observable<number> {
    return this.store.select(fromStore.selectCurrentFilter(key));
  }

  filterQueries$(key: string, suffix?: string): Observable<string[]> {
    return this.store.select(fromStore.selectFilterQueries(key));
  }

  filterValues$(key: string, suffix?: string): Observable<string[]> {
    return this.store.select(fromStore.selectFilterValues(key));
  }

  filterValue$(key: string, idx: number): Observable<string> {
    return this.filterValues$(key).pipe(
      mergeMap((values: string[]) => this.filterQueries$(key).pipe(
        map((queries: string[]) => {
          return values[idx] && values[idx] || queries[idx]
        }))
      )
    )
  }

  numberOfFilteredItems$(key: string, suffix?: string): Observable<number> {
    return this.store.select(fromStore.selectNumberOfFilteredItems(key));
  }

  filteredCollection$<M>(key: string, suffix?: string): Observable<M> {
    return this.store.select<M>(fromStore.selectFilteredCollection(key));
  }

  pagination$(key: string, suffix?: string): Observable<Pagination> {
    return this.store.select(fromStore.SelectPagination(key));
  }

  pagesCount$(key: string, suffix?: string): Observable<number> {
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

  setFilterQuery(key: string, filterQuery: string, value?: string) {
    value = value || '';
    this.store.dispatch(NgbrxPaginatorActions.setFilterQuery({ key, value, filterQuery }));
  }

  toggleActivatedFilter(key: string, filterIdx: number) {
    this.store.dispatch(NgbrxPaginatorActions.toggleActivatedFilter({ key, filterIdx }))
  }

  isActivated$(key: string, filterIdx: number): Observable<boolean> {
    return this.activatedFilters$(key).pipe(
      map((filters: number[]) => filters.indexOf(filterIdx) !== -1)
    )
  }
}
