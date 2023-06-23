import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Departement } from './departement.model';
import { DepartementActions } from './departement.actions';
import { Pagination, initialPagination } from 'ngbrx-paginator';

export const departementsFeatureKey = 'departements';

export interface State extends EntityState<Departement> {
  // additional entities state properties
  pagination: Pagination,
  filterValue: string
}

export const adapter: EntityAdapter<Departement> = createEntityAdapter<Departement>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  pagination: initialPagination,
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
    (state, action) => adapter.setAll(action.departements, state)
  ),
  on(DepartementActions.clearDepartements,
    state => adapter.removeAll(state)
  ),
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
