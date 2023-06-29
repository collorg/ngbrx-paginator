import { createFeature, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Departement } from './departement.model';
import { DepartementActions, PaginationActions } from './departement.actions';
import * as paginator from 'ngbrx-paginator';

export const departementsFeatureKey = 'departements';

export interface State extends EntityState<Departement> {
  pagination: paginator.Pagination,
}

export const adapter: EntityAdapter<Departement> = createEntityAdapter<Departement>({
  selectId: (departement: Departement) => departement.code,
});

export const initialState: State = adapter.getInitialState({
  pagination: paginator.initialPagination,
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
    (state, action) => adapter.setAll(action.departements, state)
  ),
  on(DepartementActions.clearDepartements,
    state => adapter.removeAll(state)
  ),
  
  on(PaginationActions.setPage, paginator.setPage),
  on(PaginationActions.setPageSize, paginator.setPageSize),
  on(PaginationActions.setFilterQuery, paginator.setFilterQuery),

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
export const selectedPagination = paginator.selectedPagination<State>(featureSelector);
export const selectFilterValue = paginator.selectFilterValue<State>(featureSelector);

export const selectFilteredCollection = createSelector(
  departementsFeature.selectAll,
  selectFilterValue,
  (items: Departement[], query: string) => {
    return items.filter((item: Departement) => !query || item.nom.toLowerCase().indexOf(query.toLocaleLowerCase()) === 0)
  }
);

export const selectPageItems = createSelector(
  selectFilteredCollection,
  selectedPagination,
  (items: Departement[], pagination: paginator.Pagination) => {
    return items.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize)
  }
)
