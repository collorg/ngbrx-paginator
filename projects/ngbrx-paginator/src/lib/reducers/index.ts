import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';
import { NgbrxPaginatorActions } from './ngbrx-paginator.actions';
import { NgbrxPaginatorService } from '../ngbrx-paginator.service';


export interface Pagination {
  page: number;
  pageSize: number;
  filter: string;
  pageSizeOptions: number[]
}

export const initialPagination: Pagination = {
  page: 1,
  pageSize: 0,
  filter: '',
  pageSizeOptions: [5, 10, 25, 100]
}

export interface NgbrxPagination {
  [keys: string]: Pagination
}

export const initialNgbrxPagination: NgbrxPagination = {
}

export const paginationStateFeatureKey = 'NgbrxPaginatorState';

export interface State extends NgbrxPagination {
}

export const initialState: State = {
}

export const reducers = createReducer(
  initialState,
  on(NgbrxPaginatorActions.initFeature,
    (state, action) => {
      const newState = { ...state };
      const pagination = { ...initialPagination };
      if (action.pageSizeOptions) {
        pagination.pageSizeOptions = action.pageSizeOptions;
      }
      pagination.pageSize = pagination.pageSizeOptions[0];
      newState[action.featureKey] = pagination;
      return newState;
    }
  ),
  on(NgbrxPaginatorActions.setPage,
    (state, action) => {
      const newState = { ...state }
      const pagination = { ...newState[action.featureKey] }
      pagination.page = action.page;
      newState[action.featureKey] = pagination;
      return newState;
    }
  ),
  on(NgbrxPaginatorActions.setPageSize,
    (state, action) => {
      const newState = { ...state };
      const pagination = { ...newState[action.featureKey] };
      const oldPageSize = pagination.pageSize;
      const oldPage = pagination.page;
      let newPage = Math.trunc((oldPageSize / action.pageSize) * oldPage - (oldPageSize / action.pageSize)) + 1;
      pagination.pageSize = action.pageSize;
      pagination.page = newPage;
      newState[action.featureKey] = pagination;
      return newState;
    }
  ),
  on(NgbrxPaginatorActions.setFilterQuery,
    (state, action) => {
      const newState = { ...state };
      const pagination = { ...newState[action.featureKey] };
      pagination.page = 1
      pagination.filter = action.filter
      newState[action.featureKey] = pagination;
      return newState;
    }
  )
)

export const featureSelector = createFeatureSelector<State>(paginationStateFeatureKey);

export const selectPagination = (featureKey: string) => createSelector(
  featureSelector,
  (state: State) => state[featureKey]
);


export const selectFilterValue = (featureKey: string) => createSelector(
  featureSelector,
  (state: State) => state[featureKey].filter
);

export const selectFilteredCollection = (featureKey: string) => createSelector(
  selectPagination(featureKey),
  NgbrxPaginatorService.features[featureKey].allDataSelector,
  (pagination: Pagination, collection: any) => {
    const filterFunction = NgbrxPaginatorService.features[featureKey].filterFunction;
    if (!!filterFunction && !!pagination.filter) {
      return filterFunction(collection, pagination.filter);
    }
    return collection;
  }
);

export const selectPageItems = <M>(featureKey: string) => createSelector(
  selectFilteredCollection(featureKey),
  selectPagination(featureKey),
  (items: M[], pagination: Pagination) => {
    return items.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize)
  }
)

export const selectPagesCount = (featureKey: string) => createSelector(
  selectFilteredCollection(featureKey),
  selectPagination(featureKey),
  (collection, pagination: Pagination) => {
    let pagesCount = Math.floor(collection.length / pagination.pageSize);
    if (pagesCount * pagination.pageSize < collection.length) {
      pagesCount += 1;
    }
    return pagesCount;
  }
)

export const selectNumberOfFilteredItems = (featureKey: string) => createSelector(
  selectFilteredCollection(featureKey),
  (collection) => collection.length
)
