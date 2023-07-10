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
      newState[action.key] = pagination;
      return newState;
    }
  ),
  on(NgbrxPaginatorActions.setPage,
    (state, action) => {
      const newState = { ...state }
      const pagination = { ...newState[action.key] }
      pagination.page = action.page;
      newState[action.key] = pagination;
      return newState;
    }
  ),
  on(NgbrxPaginatorActions.setPageSizeOptions,
    (state, action) => {
      const newState = { ...state }
      const pagination = { ...newState[action.key] }
      pagination.pageSizeOptions = action.pageSizeOptions;
      pagination.page = 0;
      newState[action.key] = pagination;
      return newState;
    }
  ),
  on(NgbrxPaginatorActions.setPageSize,
    (state, action) => {
      const newState = { ...state };
      const pagination = { ...newState[action.key] };
      const oldPageSize = pagination.pageSize;
      const oldPage = pagination.page;
      let newPage = Math.trunc((oldPageSize / action.pageSize) * oldPage - (oldPageSize / action.pageSize)) + 1;
      pagination.pageSize = action.pageSize;
      pagination.page = newPage;
      newState[action.key] = pagination;
      return newState;
    }
  ),
  on(NgbrxPaginatorActions.setFilterQuery,
    (state, action) => {
      const newState = { ...state };
      const pagination = { ...newState[action.key] };
      if (action.filter !== pagination.filter) {
        pagination.page = 1
        pagination.filter = action.filter
        newState[action.key] = pagination;
      }
      return newState;
    }
  )
)

export const featureSelector = createFeatureSelector<State>(paginationStateFeatureKey);

export const selectPagination = (key: string) => createSelector(
  featureSelector,
  (state: State) => state[key]
);


export const selectFilterValue = (key: string) => createSelector(
  featureSelector,
  (state: State) => state[key].filter
);

export const selectFilteredCollection = (key: string) => createSelector(
  selectPagination(key),
  NgbrxPaginatorService.features[key].allDataSelector,
  (pagination: Pagination, collection: any) => {
    const fi = NgbrxPaginatorService.features[key].filters;
    if (!!fi && !!pagination.filter) {
      return fi(collection, pagination.filter);
    }
    return collection;
  }
);

export const selectPageItems = <M>(key: string) => createSelector(
  selectFilteredCollection(key),
  selectPagination(key),
  (items: M[], pagination: Pagination) => {
    return items.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize)
  }
)

export const selectPagesCount = (key: string) => createSelector(
  selectFilteredCollection(key),
  selectPagination(key),
  (collection, pagination: Pagination) => {
    let pagesCount = Math.floor(collection.length / pagination.pageSize);
    if (pagesCount * pagination.pageSize < collection.length) {
      pagesCount += 1;
    }
    return pagesCount;
  }
)

export const selectNumberOfFilteredItems = (key: string) => createSelector(
  selectFilteredCollection(key),
  (collection) => collection.length
)
