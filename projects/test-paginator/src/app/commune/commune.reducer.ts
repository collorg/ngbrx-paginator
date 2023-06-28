import { createFeature, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Commune } from './commune.model';
import { CommuneActions, PaginationActions } from './commune.actions';
import * as paginator from 'ngbrx-paginator';

export const communesFeatureKey = 'communes';

export interface State extends EntityState<Commune> {
  pagination: paginator.Pagination,
  filterValue: string
}

export const adapter: EntityAdapter<Commune> = createEntityAdapter<Commune>({
  selectId: (commune: Commune) => commune.code,
});

export const initialState: State = adapter.getInitialState({
  pagination: paginator.initialPagination,
  filterValue: ''
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
    (state, action) => {
      let pagination = { ...state.pagination };

      const intermediateState = adapter.setAll(action.communes, { ...state })
      pagination.collectionSize = intermediateState.ids.length;
      pagination.pagesCount = paginator.getPagesCount(pagination);
      return {...intermediateState, pagination }
    }
  ),
  on(CommuneActions.clearCommunes,
    state => adapter.removeAll(state)
  ),
  
  on(PaginationActions.setPage, paginator.setPage),
  on(PaginationActions.setPageSize, paginator.setPageSize),
  on(PaginationActions.setFilterQuery, paginator.setFilterQuery),
  on(PaginationActions.setFilteredCollectionSize, paginator.setFilteredCollectionSize)

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

export const featureSelector = createFeatureSelector<State>(communesFeatureKey);

export const selectedPagination = createSelector(
  featureSelector,
  (state: State) => state.pagination
);

export const selectFilterValue = createSelector(
  featureSelector,
  (state: State) => state.filterValue
);

function filterCommune(item: Commune, query: string): Boolean {
  return !query || item.nom.toLowerCase().indexOf(query.toLocaleLowerCase()) === 0;
}


export const selectFilteredCollection = createSelector(
  communesFeature.selectAll,
  selectFilterValue,
  (items: Commune[], query: string) => items.filter((item: Commune) => filterCommune(item, query))
);

export const selectPageItems = createSelector(
  selectFilteredCollection,
  selectedPagination,
  (items: Commune[], pagination: paginator.Pagination) => 
    items.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize)
)
