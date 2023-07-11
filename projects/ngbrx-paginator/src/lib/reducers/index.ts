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
  currentFilter: string;
  filterQueries: { [key: string]: string }
  filterQuery: string;
  pageSizeOptions: number[]
}

export const initialPagination: Pagination = {
  page: 1,
  pageSize: 0,
  currentFilter: '',
  filterQueries: {},
  filterQuery: '',
  pageSizeOptions: [5, 10, 25, 100]
}

export interface NgbrxPagination {
  currentPaginator: string,
  paginators: { [keys: string]: Pagination }
}

export const initialNgbrxPagination: NgbrxPagination = {
  currentPaginator: '',
  paginators: {}
}

export const paginationStateFeatureKey = 'NgbrxPaginatorState';

export interface State extends NgbrxPagination {
}

export const initialState: State = {
  currentPaginator: '',
  paginators: {}
}

export const reducers = createReducer(
  initialState,
  on(NgbrxPaginatorActions.initPaginator,
    (state, action) => {
      const newState = { ...state };
      const pagination = { ...initialPagination };
      const paginators = { ...state.paginators };
      if (action.paginator.pageSizeOptions) {
        pagination.pageSizeOptions = action.paginator.pageSizeOptions;
      }
      const filters = action.paginator.filters;
      if (filters) {
        const filterQueries: { [key: string]: string } = {};
        const filterKeys: string[] = Object.keys(filters);
        pagination.currentFilter = filterKeys[0];
        filterKeys.forEach((key: string) => filterQueries[key] = '')
        pagination.filterQueries = filterQueries;
      }
      pagination.pageSize = pagination.pageSizeOptions[0];
      paginators[action.paginator.key] = pagination;
      newState.paginators = paginators;
      return newState;
    }
  ),
  on(NgbrxPaginatorActions.setCurrentPaginator,
    (state, action) => {
      const newState = { ...state };
      newState.currentPaginator = action.paginatorKey;
      return newState;
    }),
  on(NgbrxPaginatorActions.setPage,
    (state, action) => {
      const newState = { ...state }
      const paginators = { ...state.paginators }
      const pagination = { ...state.paginators[action.key] }
      pagination.page = action.page;
      paginators[action.key] = pagination;
      newState.paginators = paginators;
      return newState;
    }
  ),
  on(NgbrxPaginatorActions.setPageSizeOptions,
    (state, action) => {
      const newState = { ...state }
      const paginators = { ...state.paginators }
      const pagination = { ...state.paginators[action.key] }
      pagination.pageSizeOptions = action.pageSizeOptions;
      pagination.page = 0;
      paginators[action.key] = pagination;
      newState.paginators = paginators;
      return newState;
    }
  ),
  on(NgbrxPaginatorActions.setPageSize,
    (state, action) => {
      const newState = { ...state };
      const paginators = { ...state.paginators }
      const pagination = { ...state.paginators[action.key] };
      const oldPageSize = pagination.pageSize;
      const oldPage = pagination.page;
      let newPage = Math.trunc((oldPageSize / action.pageSize) * oldPage - (oldPageSize / action.pageSize)) + 1;
      pagination.pageSize = action.pageSize;
      pagination.page = newPage;
      paginators[action.key] = pagination;
      newState.paginators = paginators;
      return newState;
    }
  ),
  on(NgbrxPaginatorActions.setCurrentFilter,
    (state, action) => {
      const newState = { ...state };
      const paginators = { ...state.paginators };
      const pagination = { ...state.paginators[action.key] };
      pagination.currentFilter = action.filterKey;
      paginators[action.key] = pagination;
      newState.paginators = paginators;
      return newState;
    }
  ),
  on(NgbrxPaginatorActions.setFilterQuery,
    (state, action) => {
      const newState = { ...state };
      const paginators = { ...state.paginators };
      const pagination = { ...state.paginators[action.key] };
      if (action.filterQuery !== pagination.filterQuery) {
        pagination.page = 1;
        pagination.filterQuery = action.filterQuery;
        const filterQueries = { ...state.paginators[action.key].filterQueries }
        filterQueries[pagination.currentFilter] = action.filterQuery;
        pagination.filterQueries = filterQueries;
        paginators[action.key] = pagination;
        newState.paginators = paginators;
      }
      return newState;
    }
  )
)

export const featureSelector = createFeatureSelector<State>(paginationStateFeatureKey);

export const selectPagination = (key: string) => createSelector(
  featureSelector,
  (state: State) => state.paginators[key]
);


export const selectCurrentFilter = (key: string) => createSelector(
  featureSelector,
  (state: State) => state.paginators[key].currentFilter
);

export const selectFilterQuery = (key: string) => createSelector(
  featureSelector,
  (state: State) => {
    const filters = state.paginators[key].filterQueries;
    const currentfilter = state.paginators[key].currentFilter;
    return filters[currentfilter]
  }
);

export const selectFilterQueries = (key: string) => createSelector(
  featureSelector,
  (state: State) => state.paginators[key].filterQueries
);

export const selectFilteredCollection = (key: string) => createSelector(
  featureSelector,
  NgbrxPaginatorService.features[key].allDataSelector,
  (state: State, collection: any) => {
    const paginator = NgbrxPaginatorService.features[key];
    const filters = paginator.filters;
    const stateFilters = state.paginators[key].filterQueries;
    const currentFilter = state.paginators[key].currentFilter;
    if (filters && !!stateFilters[currentFilter]) {
      return filters[currentFilter](collection, stateFilters[currentFilter]);
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
