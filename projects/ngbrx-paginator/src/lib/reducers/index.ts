import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';
import { NgbrxPaginatorActions } from './ngbrx-paginator.actions';
import { Pagination, initialPagination } from '../ngbrx-paginator.model';
import { NgbrxPaginatorService, previousState } from '../ngbrx-paginator.service';

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

function cloneStateWithPaginator(state: State, paginationKey: string) {
  const { nState, paginations } = cloneState(state);
  return { nState, paginations, pagination: { ...paginations[paginationKey] } }
}

function updateSate(state: State, paginations: { [key: string]: Pagination }, key?: string, pagination?: Pagination): State {
  if (key && pagination) {
    paginations[key] = pagination;
  }
  state.paginations = paginations;
  window.localStorage.setItem('ngbrx-paginator', JSON.stringify(state.paginations))
  return state;
}

export const reducers = createReducer(
  initialState,
  on(NgbrxPaginatorActions.initPaginator,
    (state, action) => {
      const { nState, paginations } = cloneState(state);
      const filters = Object.keys(action.paginator.filters);
      const refFilters = [...filters].sort()
      let iPagination = initialPagination;
      if (previousState) {
        if (Object.keys(previousState).indexOf(action.key) > -1) {
          const previousFilters = [...previousState[action.key].filters].sort()
          const pPagination = previousState[action.key];
          if (previousFilters.join('|') === refFilters.join('|')) {
            iPagination = pPagination;
          }
        }
      }
      const pagination = { ...iPagination };
      const activatedFilters: number[] = [];
      filters.forEach((filter, index) => {
        if (!action.paginator.filters[filter].inactivate) {
          activatedFilters.push(index);
        }
      });
      if (filters) {
        const filterQueries: string[] = [];
        filters.forEach(_ => filterQueries.push(''));
        pagination.activatedFilters = iPagination && iPagination.activatedFilters && iPagination.activatedFilters.length && iPagination.activatedFilters || activatedFilters;
        pagination.filters = iPagination && iPagination.filters.length && iPagination.filters || filters;
        pagination.currentFilter = iPagination && iPagination.currentFilter > -1 && iPagination.currentFilter || 0;
        pagination.filterQueries = iPagination && iPagination.filterQueries.length && iPagination.filterQueries || filterQueries;
      }
      if (action.paginator.pageSizeOptions) {
        pagination.pageSizeOptions = action.paginator.pageSizeOptions;
      }
      pagination.pageSize = iPagination && (pagination.pageSizeOptions.indexOf(pagination.pageSize) > -1 && iPagination.pageSize) || pagination.pageSizeOptions[0];
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
      pagination.currentFilter = action.filterIdx;
      return updateSate(nState, paginations, action.key, pagination)
    }
  ),
  on(NgbrxPaginatorActions.setFilterQuery,
    (state, action) => {
      const { nState, paginations, pagination } = cloneStateWithPaginator(state, action.key);
      const filterQueries = [...state.paginations[action.key].filterQueries]
      const filterIdx = pagination.currentFilter;
      if (filterIdx > -1 && action.filterQuery !== filterQueries[filterIdx]) {
        pagination.page = 1;
        filterQueries[pagination.currentFilter] = action.filterQuery;
        pagination.filterQueries = filterQueries;
      }
      return updateSate(nState, paginations, action.key, pagination)
    }),
  on(NgbrxPaginatorActions.toggleActivatedFilter,
    (state, action) => {
      const { nState, paginations, pagination } = cloneStateWithPaginator(state, action.key);
      const activatedFilters = [...state.paginations[action.key].activatedFilters];
      const activatedFilterIdx = activatedFilters.indexOf(action.filterIdx)
      if (activatedFilterIdx === -1) {
        activatedFilters.push(action.filterIdx)
      } else {
        activatedFilters.splice(activatedFilterIdx, 1);
      }
      activatedFilters.sort();
      pagination.activatedFilters = activatedFilters;
      return updateSate(nState, paginations, action.key, pagination)
    })
)

export const featureSelector = createFeatureSelector<State>(paginationStateFeatureKey);

export const SelectPagination = (key: string) => createSelector(
  featureSelector,
  (state: State) => state.paginations && state.paginations[key]
);


export const selectCurrentFilter = (key: string) => createSelector(
  featureSelector,
  (state: State) => state.paginations && state.paginations[key] && state.paginations[key].currentFilter
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

export const selectFilters = (key: string) => createSelector(
  featureSelector,
  (state: State) => state.paginations && state.paginations[key] && state.paginations[key].filters || []
);

export const selectActivatedFilters = (key: string) => createSelector(
  featureSelector,
  (state: State) => state.paginations && state.paginations[key] && state.paginations[key].activatedFilters || []
);

export const selectFilteredCollection = (key: string) => createSelector(
  featureSelector,
  NgbrxPaginatorService.paginators[key].allDataSelector,
  (state: State, collection: any) => {
    const paginator = NgbrxPaginatorService.paginators[key];
    const filters = paginator.filters;
    const pagination = state.paginations[key];
    if (pagination) {
      const stateFilters: string[] = pagination.filters;
      const activatedFilters = pagination.activatedFilters;
      const filterQueries = pagination.filterQueries;
      let filteredCollection: any[] = collection;
      filterQueries.forEach((query: string, index: number) => {
        if (query !== '' && activatedFilters.indexOf(index) !== -1) {
          filteredCollection = filters[stateFilters[index]].filter(filteredCollection, query);
        }
      })
      return filteredCollection;
    }
    return collection;
  }
);

export const selectPageItems = <M>(key: string) => createSelector(
  selectFilteredCollection(key),
  SelectPagination(key),
  (items: M[], pagination: Pagination) => {
    if (pagination) {
      return items.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize)
    }
    return items;
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
