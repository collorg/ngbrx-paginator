import { Injectable } from '@angular/core';
import { Store, Selector } from '@ngrx/store';

import * as fromStore from './reducers';
import { Observable } from 'rxjs';


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

  hasFilter(feature: string) {
    console.log('XXX hasFilter', feature)
    return NgbrxPaginatorService.features[feature].filterFunction !== null;
  }

  getPageItems$<M>(feature: string): Observable<M[]> {
    console.log('XXX getPageItems$', feature, NgbrxPaginatorService.features)
    const a = this.store.select(fromStore.selectPageItems<M>(feature));
    console.log('XXX OK')
    return a;
  }

  static add(featureKey: string, filterFunction: FilterFunction<any>, allDataSelector: Selector<object, any[]>) {
    NgbrxPaginatorService.features[featureKey] = { filterFunction, allDataSelector };
  }

  filterValue$(feature: string): Observable<string> {
    return this.store.select(fromStore.selectFilterValue(feature))
  }

  numberOfFilteredItems$(feature: string): Observable<number> {
    return this.store.select(fromStore.selectNumberOfFilteredItems(feature))
  }

}
