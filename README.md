# NgbrxPaginator

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.2.

## Usage (example with an EntityState)

The code is extracted from the [departement](./projects/test-paginator/src/app/departement) module

Add the `NgbrxPaginatorModule` in your [departement](./projects/test-paginator/src/app/departement/departement.module.ts) dependencies:

```ts
import { NgbrxPaginatorModule } from 'ngbrx-paginator';

@NgModule({
  declarations: [
    DepartementsComponent
  ],
  imports: [
    [...]
    NgbrxPaginatorModule,
    StoreModule.forFeature(fromDepartement.departementsFeature),
  ],
  exports: [
    DepartementsComponent
  ]
})
```


Add the pagination actions in the [actions](./projects/test-paginator/src/app/departement/departement.actions.ts) module:

```ts
export const DepartementActionsPrefix = 'Departement/API';

export const PaginationActions = paginator.createPaginationActions(DepartementActionsPrefix);

```

In your feature [reducer](./projects/test-paginator/src/app/departement/departement.reducer.ts), add the pagination entry in your state:

```ts
import * as paginator from 'ngbrx-paginator';

export interface State extends EntityState<MyData> {
  pagination: paginator.Pagination,
}

export const adapter: EntityAdapter<MyData> = createEntityAdapter<MyData>();

export const initialState: State = {
  pagination: paginator.initialPagination,
};
```

Add the handlers of the pagination actions in your reducer:

```ts
export const reducer = createReducer(
  initialState,
  [...]
  on(PaginationActions.setPage, paginator.setPage),
  on(PaginationActions.setPageSize, paginator.setPageSize),
  on(PaginationActions.setFilterQuery, paginator.setFilterQuery),

```

And finally the selectors:

```ts
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

```

in your component class add the attributes `actions`, `collection$`, `pagination$` and `pageItems$`:

```ts
[...]
import { PaginationActions } from '../departement.actions';
import { Departement } from '../departement.model';
import * as fromStore from '../departement.reducer';
import { Pagination } from 'ngbrx-paginator';

@Component({
  selector: 'app-departements',
  templateUrl: './departements.component.html',
  styleUrls: ['./departements.component.css']
})
export class DepartementsComponent {
  actions = PaginationActions;
  collection$: Observable<Departement[]> = this.store.select(fromStore.selectFilteredCollection);
  pagination$: Observable<Pagination> = this.store.select(fromStore.selectedPagination);

  pageItems$: Observable<Departement[]> = this.store.select(fromStore.selectPageItems);

  constructor(
    private store: Store
  ) { }
}
```

And finally, use the lib-ngbrx-paginator component in your [template](./projects/test-paginator/src/app/departement/departements/departements.component.html):

```html
<lib-ngbrx-paginator
  [collection$]="collection$"
  [pagination$]="pagination$"
  [actions]="actions"
></lib-ngbrx-paginator>
```

You have to replace the observable of the collection you used to iterate over the items by `pageItems$`:


```html
<div class="list-group">
  <div class="list-group-item" *ngFor="let item of pageItems$ | async">
    {{ item.code }} {{ item.nom }}
  </div>
</div>
```
