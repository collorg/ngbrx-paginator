import { MemoizedSelector, createFeature, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Departement } from './departement.model';
import { DepartementActions } from './departement.actions';

export const departementsFeatureKey = 'departements';

export interface State extends EntityState<Departement> {
}

export const adapter: EntityAdapter<Departement> = createEntityAdapter<Departement>({
  selectId: (departement: Departement) => departement.code,
});

export const initialState: State = adapter.getInitialState({
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

export const selectRegions = createSelector(
  selectAll,
  (departements: Departement[]) => {
    const regions: string[] = [];
    departements.forEach((departement: Departement) => {
      if (regions.indexOf(departement.region) === -1) {
        regions.push(departement.region)
      }
    });
    return regions.sort();
  }
)

export function byName(items: Departement[], query: string): Departement[] {
  return items.filter((item: Departement) => !query || item.nom.toLowerCase().indexOf(query.toLocaleLowerCase()) === 0)
}

export function byCode(items: Departement[], query: string): Departement[] {
  return items.filter((item: Departement) => !query || item.code === query)
}

export function byRegion(items: Departement[], query: string): Departement[] {
  return items.filter((item: Departement) => !query || item.region.toLowerCase().indexOf(query.toLocaleLowerCase()) === 0)
}
