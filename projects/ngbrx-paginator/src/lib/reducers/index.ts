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
  selectedFilters: string[];
  filterQueries: { [key: string]: string };
  pageSizeOptions: number[];
}

export const initialPagination: Pagination = {
  page: 1,
  pageSize: 0,
  currentFilter: '',
  selectedFilters: [],
  filterQueries: {},
  pageSizeOptions: [5, 10, 25, 100]
}

export interface NgbrxPagination {
  currentPaginator: string,
  paginations: { [keys: string]: Pagination }
}

export const initialNgbrxPagination: NgbrxPagination = {
  currentPaginator: '',
  paginations: {}
}

export const paginationStateFeatureKey = 'NgbrxPaginatorState';

export interface State extends NgbrxPagination {
}

export const initialState: State = {
  currentPaginator: '',
  paginations: {}
}

function cloneState(state: State) {
  return { nState: { ...state }, paginations: { ...state.paginations } };
}

function cloneStateWithPaginator(state: State, paginatorKey: string) {
  const { nState, paginations } = cloneState(state);
  return { nState, paginations, pagination: { ...paginations[paginatorKey] } }
}

function updateSate(state: State, paginations: { [key: string]: Pagination}, key?: string, pagination?: Pagination): State {
  if (key && pagination) {
    paginations[key] = pagination;
  }
  state.paginations = paginations;
  return state;
}

export const reducers = createReducer(
  initialState,
  on(NgbrxPaginatorActions.initPaginator,
    (state, action) => {
      const { nState, paginations } = cloneState(state);
      const pagination = { ...initialPagination };
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
      return updateSate(nState, paginations, action.key, pagination)
    }
  ),
  on(NgbrxPaginatorActions.setPage,
    (state, action) => {
      const { nState, paginations, pagination } = cloneStateWithPaginator(state, action.key);
      pagination.page = action.page;
      return updateSate(nState, paginations, action.key, pagination)
    }
  ),
  on(NgbrxPaginatorActions.setPageSizeOptions,
    (state, action) => {
      const { nState, paginations, pagination } = cloneStateWithPaginator(state, action.key);
      pagination.pageSizeOptions = action.pageSizeOptions;
      pagination.page = 0;
      return updateSate(nState, paginations, action.key, pagination)
    }
  ),
  on(NgbrxPaginatorActions.setPageSize,
    (state, action) => {
      const { nState, paginations, pagination } = cloneStateWithPaginator(state, action.key);
      const oldPageSize = pagination.pageSize;
      const oldPage = pagination.page;
      let newPage = Math.trunc((oldPageSize / action.pageSize) * oldPage - (oldPageSize / action.pageSize)) + 1;
      pagination.pageSize = action.pageSize;
      pagination.page = newPage;
      return updateSate(nState, paginations, action.key, pagination)
    }
  ),
  on(NgbrxPaginatorActions.setCurrentFilter,
    (state, action) => {
      const { nState, paginations, pagination } = cloneStateWithPaginator(state, action.key);
      pagination.currentFilter = action.filterKey;
      return updateSate(nState, paginations, action.key, pagination)
    }
  ),
  on(NgbrxPaginatorActions.selectFilter,
    (state, action) => {
      const { nState, paginations, pagination } = cloneStateWithPaginator(state, action.key);
      const selectedFilters = [...pagination.selectedFilters]
      const index = selectedFilters.indexOf(action.filterKey);
      if (index === -1) {
        selectedFilters.push(action.filterKey);
      } else {
        selectedFilters.splice(index, 1);
      }
      pagination.selectedFilters = selectedFilters;
      return updateSate(nState, paginations, action.key, pagination)
    }),
  on(NgbrxPaginatorActions.setFilterQuery,
    (state, action) => {
      const { nState, paginations, pagination } = cloneStateWithPaginator(state, action.key);
      const filterQueries = { ...state.paginations[action.key].filterQueries }
      if (action.filterQuery !== filterQueries[pagination.currentFilter]) {
        pagination.page = 1;
        filterQueries[pagination.currentFilter] = action.filterQuery;
        pagination.filterQueries = filterQueries;
      }
      return updateSate(nState, paginations, action.key, pagination)
    }
  )
)

export const featureSelector = createFeatureSelector<State>(paginationStateFeatureKey);

export const SelectPagination = (key: string) => createSelector(
  featureSelector,
  (state: State) => state.paginations && state.paginations[key]
);


export const selectCurrentFilter = (key: string) => createSelector(
  featureSelector,
  (state: State) => state.paginations && state.paginations[key] && state.paginations[key].currentFilter || ''
);

export const selectFilterQuery = (key: string) => createSelector(
  featureSelector,
  (state: State) => {
    const filters = state.paginations[key].filterQueries;
    const currentFilter = state.paginations[key].currentFilter;
    return filters[currentFilter];
  }
);

export const selectFilterQueries = (key: string) => createSelector(
  featureSelector,
  (state: State) => state.paginations && state.paginations[key] && state.paginations[key].filterQueries || []
);

export const selectSelectedFilters = (key: string) => createSelector(
  featureSelector,
  (state: State) => state.paginations && state.paginations[key] && state.paginations[key].selectedFilters || []
);

export const selectFilteredCollection = (key: string) => createSelector(
  featureSelector,
  NgbrxPaginatorService.paginators[key].allDataSelector,
  (state: State, collection: any) => {
    const paginator = NgbrxPaginatorService.paginators[key];
    const filters = paginator.filters;
    const selectedFilters = state.paginations[key].selectedFilters;
    const stateFilters = state.paginations[key].filterQueries;
    const currentFilter = state.paginations[key].currentFilter;
    if (selectedFilters || filters) {
      let filteredCollection = filters[currentFilter].filter(collection, stateFilters[currentFilter]);
      selectedFilters.forEach((filterKey: string) => {
        filteredCollection = filters[filterKey].filter(filteredCollection, stateFilters[filterKey]);
      });
      return filteredCollection;
    }
    return collection;
  }
);

export const selectPageItems = <M>(key: string) => createSelector(
  selectFilteredCollection(key),
  SelectPagination(key),
  (items: M[], pagination: Pagination) => {
    return items.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize)
  }
)

export const selectPagesCount = (key: string) => createSelector(
  selectFilteredCollection(key),
  SelectPagination(key),
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

export const selectCurrentFilterDesc = (key: string) => createSelector(
  selectCurrentFilter(key),
  selectSelectedFilters(key),
  selectFilterQueries(key),
  (current: string, selected: string[], queries: { [key: string]: string }) => {
    let desc: string[] = [];
    Object.keys(queries).forEach((key: string) => {
      if (key === current || selected.indexOf(key) > -1) {
        if (queries[key]) {
          desc.push(`${key} "${queries[key]}"`);
        }
      }
    })
    return desc.join(' & ')
  }
)