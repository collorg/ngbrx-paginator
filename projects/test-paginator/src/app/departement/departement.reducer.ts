import { createFeature, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Departement } from './departement.model';
import { DepartementActions, PaginationActions } from './departement.actions';
import * as paginator from 'ngbrx-paginator';

export const departementsFeatureKey = 'departements';

export interface State extends EntityState<Departement> {
  pagination: paginator.Pagination,
  filterValue: string
}

export const adapter: EntityAdapter<Departement> = createEntityAdapter<Departement>({
  selectId: (departement: Departement) => departement.code,
});

export const initialState: State = adapter.getInitialState({
  pagination: paginator.initialPagination,
  filterValue: ''
});

export const reducer = createReducer(
  initialState,
  on(DepartementActions.addDepartement,
    (state, action) => adapter.addOne(action.departement, state)
  ),
  on(DepartementActions.upsertDepartement,
    (state, action) => adapter.upsertOne(action.departement, state)
  ),
  on(DepartementActions.addDepartements,
    (state, action) => adapter.addMany(action.departements, state)
  ),
  on(DepartementActions.upsertDepartements,
    (state, action) => adapter.upsertMany(action.departements, state)
  ),
  on(DepartementActions.updateDepartement,
    (state, action) => adapter.updateOne(action.departement, state)
  ),
  on(DepartementActions.updateDepartements,
    (state, action) => adapter.updateMany(action.departements, state)
  ),
  on(DepartementActions.deleteDepartement,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(DepartementActions.deleteDepartements,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(DepartementActions.loadDepartements,
    (state, action) => {
      let pagination = { ...state.pagination };
      pagination.collectionSize = action.departements.length;
      pagination.pagesCount = paginator.getPagesCount(pagination);

      return adapter.setAll(action.departements, { ...state, pagination })
    }
  ),
  on(DepartementActions.clearDepartements,
    state => adapter.removeAll(state)
  ),
  
  on(PaginationActions.setPage, paginator.setPage),
  on(PaginationActions.setPageSize, paginator.setPageSize),
  on(PaginationActions.setFilterQuery, paginator.setFilterQuery),
  on(PaginationActions.setFilteredCollectionSize, paginator.setFilteredCollectionSize)

);

export const departementsFeature = createFeature({
  name: departementsFeatureKey,
  reducer,
  extraSelectors: ({ selectDepartementsState }) => ({
    ...adapter.getSelectors(selectDepartementsState)
  }),
});

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = departementsFeature;

export const featureSelector = createFeatureSelector<State>(departementsFeatureKey);

export const selectedPagination = createSelector(
  featureSelector,
  (state: State) => state.pagination
);

export const selectFilterValue = createSelector(
  featureSelector,
  (state: State) => state.filterValue
);

function filterDepartement(item: Departement, query: string): Boolean {
  return !query || item.nom.toLowerCase().indexOf(query.toLocaleLowerCase()) === 0;
}


export const selectFilteredCollection = createSelector(
  departementsFeature.selectAll,
  selectFilterValue,
  (items: Departement[], query: string) => {
    return items.filter((item: Departement) => filterDepartement(item, query))
  }
);

export const selectPageItems = createSelector(
  selectFilteredCollection,
  selectedPagination,
  (items: Departement[], pagination: paginator.Pagination) => {
    return items.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize)
  }
)
