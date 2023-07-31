import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';
import { NgbrxPaginatorActions } from './ngbrx-paginator.actions';
import { NgbrxPaginatorService } from '../ngbrx-paginator.service';
import { Pagination, initialPagination } from '../ngbrx-paginator.model';


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
      const filters = Object.keys(action.paginator.filters);
      if (filters) {
        const filterQueries: string[] = []
        filters.forEach(_ => filterQueries.push(''))
        pagination.filters = filters;
        pagination.currentFilter = 0;
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
      pagination.currentFilter = action.filterIdx;
      return updateSate(nState, paginations, action.key, pagination)
    }
  ),
  on(NgbrxPaginatorActions.selectFilter,
    (state, action) => {
      const { nState, paginations, pagination } = cloneStateWithPaginator(state, action.key);
      const selectedFilters = [...pagination.selectedFilters]
      const index = action.filterIdx;
      const isSelected: number = pagination.selectedFilters.indexOf(index);
      if (isSelected === -1) {
        selectedFilters.push(index);
      } else {
        selectedFilters.splice(index, 1);
      }
      pagination.selectedFilters = selectedFilters;
      return updateSate(nState, paginations, action.key, pagination)
    }),
  on(NgbrxPaginatorActions.setFilterQuery,
    (state, action) => {
      const { nState, paginations, pagination } = cloneStateWithPaginator(state, action.key);
      const filterQueries = [ ...state.paginations[action.key].filterQueries ]
      const filterIdx = pagination.currentFilter;
      if (filterIdx > -1 && action.filterQuery !== filterQueries[filterIdx]) {
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
    const stateFilters: string[] = state.paginations[key].filters;
    const selectedFilters = state.paginations[key].selectedFilters;
    const filterQueries = state.paginations[key].filterQueries;
    const currentFilterIdx = state.paginations[key].currentFilter;
    const currentFilter = stateFilters[currentFilterIdx];
    if (currentFilterIdx > -1 || selectedFilters || filters) {
      let filteredCollection = filters[currentFilter].filter(collection, filterQueries[currentFilterIdx]);
      selectedFilters.forEach((index: number) => {
        filteredCollection = filters[stateFilters[index]].filter(filteredCollection, filterQueries[index]);
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
  selectFilters(key),
  selectCurrentFilter(key),
  selectSelectedFilters(key),
  selectFilterQueries(key),
  (filters: string[], current: number, selected: number[], queries: string[]) => {
    let desc: string[] = [];
    queries.forEach((query: string, index: number) => {
      if (index === current || selected.indexOf(index) > -1) {
        if (queries[index]) {
          desc.push(`${filters[index]} "${query}"`);
        }
      }
    })
    return desc.join(' & ')
  }
)