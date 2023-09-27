import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from './reducers';
import { NgbrxPaginatorActions } from './reducers/ngbrx-paginator.actions';
import { BehaviorSubject, EMPTY, Observable, distinctUntilChanged, filter, map, mergeMap, of, switchMap } from 'rxjs';
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
  #paginatorKeys: string[] = [];
  #paginatorKeysSubject: BehaviorSubject<string[]> = new BehaviorSubject(this.#paginatorKeys);
  paginatorKeys$: Observable<string[]> = this.#paginatorKeysSubject.asObservable();

  constructor(private store: Store) { }


  initPaginators(paginators: Paginators<any>) {
    const pag = { ...sp.paginators }
    Object.keys(paginators).forEach((key) => {
      if (!Object.keys(pag).includes(key)) {
        pag[key] = paginators[key]
      }
    })
    sp.paginators = pag;
  }

  getKey(key: string, extension?: string): string {
    if (!!extension) {
      return `${key}-${extension}`;
    }
    return key;
  }

  setPaginator<M>(key: string, data$: Observable<any[]>, extension?: string): Observable<M[]> {
    const newPaginators = { ...sp.paginators }
    let paginator = { ...sp.paginators[key] };
    key = this.getKey(key, extension)
    if (!this.#paginatorKeys.includes(key)) {
      this.store.dispatch(NgbrxPaginatorActions.setPaginator({ key, paginator }));
      newPaginators[key] = { ...paginator, data$: data$.pipe(map((data: any[]) => data)) };
      this.#paginatorKeys.push(key);
      this.#paginatorKeysSubject.next(this.#paginatorKeys);
      sp.paginators = newPaginators;
    }
    return this.getPageItems$(key);
  }

  static get paginators() {
    return sp.paginators
  }

  getFilterValues$(paginationKey: string, filterKey: string): Observable<any> {
    return this.store.select((
      sp.paginators && sp.paginators[paginationKey] &&
      sp.paginators[paginationKey].filters &&
      sp.paginators[paginationKey].filters[filterKey] &&
      sp.paginators[paginationKey].filters[filterKey].values) ||
      fromStore.selectUndefined).pipe(
        distinctUntilChanged()
      );
  }

  hasKey$(key: string): Observable<boolean> {
    return this.paginatorKeys$.pipe(
      map((paginatorKeys: string[]) => !!paginatorKeys.includes(key))
    )
  }

  #getData$<M>(key: string): Observable<M[]> {
    return this.hasKey$(key).pipe(
      filter((hasKey) => hasKey),
      switchMap((hasKey: boolean) => hasKey && sp.paginators[key].data$ || EMPTY)
    )
  }

  hasFilter(key: string): boolean {
    if (sp.paginators[key]) {
      return Object.keys(sp.paginators[key].filters).length > 0;
    }
    return false;
  }

  getPageItems$<M>(paginatorKey: string): Observable<M[]> {
    return this.#getData$<M>(paginatorKey).pipe(
      switchMap(data => this.store.select(fromStore.selectPageItems<M>(paginatorKey, of(data))))
    )
  }

  filters$(key: string): Observable<string[]> {
    return this.store.select(fromStore.selectFilters(key));
  }

  activatedFilters$(key: string): Observable<number[]> {
    return this.store.select(fromStore.selectActivatedFilters(key));
  }

  currentFilter$(key: string): Observable<number> {
    return this.store.select(fromStore.selectCurrentFilter(key));
  }

  filterQueries$(key: string): Observable<string[]> {
    return this.store.select(fromStore.selectFilterQueries(key));
  }

  filterValues$(key: string): Observable<string[]> {
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

  numberOfFilteredItems$<M>(paginatorKey: string): Observable<number> {
    return this.#getData$<M>(paginatorKey).pipe(
      switchMap(data$ => this.store.select(fromStore.selectNumberOfFilteredItems(paginatorKey, of(data$))))
    )
  }

  filteredCollection$<M>(paginatorKey: string): Observable<M[]> {
    return this.#getData$<M>(paginatorKey).pipe(
      switchMap(data$ => this.store.select(fromStore.selectFilteredCollection(paginatorKey, of(data$))))
    )
  }

  pagination$(key: string): Observable<Pagination> {
    return this.store.select(fromStore.SelectPagination(key));
  }

  pagesCount$<M>(paginatorKey: string): Observable<number> {
    return this.#getData$<M>(paginatorKey).pipe(
      switchMap(data$ => this.store.select(fromStore.selectPagesCount(paginatorKey, of(data$))))
    )
  }

  setPage(key: string, page: number): number {
    this.store.dispatch(NgbrxPaginatorActions.setPage({ key, page }));
    window.scrollTo(0, 0);
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
    this.store.dispatch(NgbrxPaginatorActions.setPage({ key, page: 1 }))
  }

  toggleActivatedFilter(key: string, filterIdx: number) {
    this.store.dispatch(NgbrxPaginatorActions.toggleActivatedFilter({ key, filterIdx }))
  }

  isActivated$(key: string, filterIdx: number): Observable<boolean> {
    return this.activatedFilters$(key).pipe(
      map((filters: number[]) => filters.indexOf(filterIdx) !== -1)
    )
  }

  clearFilters(key: string) {
    this.store.dispatch(NgbrxPaginatorActions.clearFilters({ key }))
  }

  filterIsSet$(key: string): Observable<boolean> {
    return this.store.select(fromStore.selectFilterQueries(key)).pipe(
      map((queries: string[]) => queries.join('') !== '')
    )
  }

}
