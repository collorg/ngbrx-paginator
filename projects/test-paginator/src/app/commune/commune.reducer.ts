import { createFeature, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Commune } from './commune.model';
import { CommuneActions } from './commune.actions';

export const communesFeatureKey = 'communes';

export interface State extends EntityState<Commune> {
}

export const adapter: EntityAdapter<Commune> = createEntityAdapter<Commune>({
  selectId: (commune: Commune) => commune.code,
});

export const initialState: State = adapter.getInitialState({
});

export const reducer = createReducer(
  initialState,
  on(CommuneActions.addCommune,
    (state, action) => adapter.addOne(action.commune, state)
  ),
  on(CommuneActions.upsertCommune,
    (state, action) => adapter.upsertOne(action.commune, state)
  ),
  on(CommuneActions.addCommunes,
    (state, action) => adapter.addMany(action.communes, state)
  ),
  on(CommuneActions.upsertCommunes,
    (state, action) => adapter.upsertMany(action.communes, state)
  ),
  on(CommuneActions.updateCommune,
    (state, action) => adapter.updateOne(action.commune, state)
  ),
  on(CommuneActions.updateCommunes,
    (state, action) => adapter.updateMany(action.communes, state)
  ),
  on(CommuneActions.deleteCommune,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(CommuneActions.deleteCommunes,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(CommuneActions.loadCommunes,
    (state, action) => adapter.setAll(action.communes, state)
  ),
  on(CommuneActions.clearCommunes,
    state => adapter.removeAll(state)
  ),

);

export const communesFeature = createFeature({
  name: communesFeatureKey,
  reducer,
  extraSelectors: ({ selectCommunesState }) => ({
    ...adapter.getSelectors(selectCommunesState)
  }),
});

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = communesFeature;

communesFeature.selectAll

export function byName(items: Commune[], query: string): Commune[] {
  return items.filter((item: Commune) => !query || item.nom.toLowerCase().indexOf(query.toLocaleLowerCase()) === 0)
}

export function byCode(items: Commune[], query: string): Commune[] {
  return items.filter((item: Commune) => !query || item.code.indexOf(query) === 0)
}
