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
  on(NgbrxPaginatorActions.selectFilter,
    (state, action) => {
      const newState = { ...state };
      const paginators = { ...state.paginators };
      const pagination = { ...state.paginators[action.key] };
      const selectedFilters = [...pagination.selectedFilters]
      const index = selectedFilters.indexOf(action.filterKey);
      if (index === -1) {
        selectedFilters.push(action.filterKey);
      } else {
        selectedFilters.splice(index, 1);
      }
      pagination.selectedFilters = selectedFilters;
      paginators[action.key] = pagination;
      newState.paginators = paginators;
      return newState;
    }),
  on(NgbrxPaginatorActions.setFilterQuery,
    (state, action) => {
      const newState = { ...state };
      const paginators = { ...state.paginators };
      const pagination = { ...state.paginators[action.key] };
      const filterQueries = { ...state.paginators[action.key].filterQueries }
      if (action.filterQuery !== filterQueries[pagination.currentFilter]) {
        pagination.page = 1;
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
  (state: State) => state.paginators && state.paginators[key]
);


export const selectCurrentFilter = (key: string) => createSelector(
  featureSelector,
  (state: State) => state.paginators && state.paginators[key] && state.paginators[key].currentFilter || ''
);

export const selectFilterQuery = (key: string) => createSelector(
  featureSelector,
  (state: State) => {
    const filters = state.paginators[key].filterQueries;
    const currentFilter = state.paginators[key].currentFilter;
    return filters[currentFilter];
  }
);

export const selectFilterQueries = (key: string) => createSelector(
  featureSelector,
  (state: State) => state.paginators && state.paginators[key] && state.paginators[key].filterQueries || []
);

export const selectSelectedFilters = (key: string) => createSelector(
  featureSelector,
  (state: State) => state.paginators && state.paginators[key] && state.paginators[key].selectedFilters || []
);

export const selectFilteredCollection = (key: string) => createSelector(
  featureSelector,
  NgbrxPaginatorService.features[key].allDataSelector,
  (state: State, collection: any) => {
    const paginator = NgbrxPaginatorService.features[key];
    const filters = paginator.filters;
    const selectedFilters = state.paginators[key].selectedFilters;
    const stateFilters = state.paginators[key].filterQueries;
    const currentFilter = state.paginators[key].currentFilter;
    if (selectedFilters || filters) {
      let filteredCollection = filters[currentFilter](collection, stateFilters[currentFilter]);
      selectedFilters.forEach((filterKey: string) => {
        filteredCollection = filters[filterKey](filteredCollection, stateFilters[filterKey]);
      });
      return filteredCollection;
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

export const selectCurrentFilterDesc = (key: string) => createSelector(
  selectCurrentFilter(key),
  selectSelectedFilters(key),
  selectFilterQueries(key),
  (current: string, selected: string[], queries: { [key: string]: string }) => {
    let desc: string[] = [];
    Object.keys(queries).forEach((key: string) => {
      if (key === current || selected.indexOf(key) > -1) {
        if (queries[key]) {
          desc.push(`${key}: ${queries[key]}`);
        }
      }
    })
    return desc.join(' & ')
  }
)