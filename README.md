# NgbrxPaginator

Easy reactive pagination with [ngrx](https://ngrx.io/) and [ng-bootstrap](https://ng-bootstrap.github.io). 

### Demo

https://collorg.github.io/ngbrx-paginator-demo

### Installation

```bash
yarn add ngbrx-paginator
```

### Before (unpaginated list):

* component:
```ts
  collection$: Observable<D[]> = this.store.select(fromStore.selectCollection);
```
* template:
```html
  <div class="list-group">
    <div class="list-group-item" *ngFor="let item of collection$ | async">
      {{ item }}
    </div>
  </div>
```

### After:

* component:
```ts
  actions = PaginationActions;
  collection$: Observable<D[]> = this.store.select(fromStore.selectFilteredCollection);
  pagination$: Observable<Pagination> = this.store.select(fromStore.selectPagination);
  pageItems$: Observable<D[]> = this.store.select(fromStore.selectPageItems);
```
* template:
```html
  <lib-ngbrx-paginator
    [collection$]="collection$"
    [pagination$]="pagination$"
    [actions]="actions"
  ></lib-ngbrx-paginator>
  
  <div class="list-group">
    <div class="list-group-item" *ngFor="let item of pageItems$ | async">
      {{ item }}
    </div>
  </div>
```

## Usage

The example code is extracted from the [departement](./projects/test-paginator/src/app/departement) module

Add the `NgbrxPaginatorModule` in your [departement.module.ts](./projects/test-paginator/src/app/departement/departement.module.ts) dependencies:

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

And finally the selectors (you have to provide a filterFunction for the selector `selectFilteredCollection`):

```ts
export const featureSelector = createFeatureSelector<State>(departementsFeatureKey);
export const selectPagination = paginator.selectPagination<State>(featureSelector);
export const selectFilterValue = paginator.selectFilterValue<State>(featureSelector);

export const selectFilteredCollection = createSelector(
  departementsFeature.selectAll,
  selectFilterValue,
  (items: Departement[], query: string) => {
    return filterFunction(item, query)
  }
);

export const selectPageItems = createSelector(
  selectFilteredCollection,
  selectPagination,
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
  pagination$: Observable<Pagination> = this.store.select(fromStore.selectPagination);

  pageItems$: Observable<Departement[]> = this.store.select(fromStore.selectPageItems);

  constructor(
    private store: Store
  ) { }
}
```

And finally, use the ngbrx-paginator component in your [template](./projects/test-paginator/src/app/departement/departements/departements.component.html):

```html
<ngbrx-paginator
  [collection$]="collection$"
  [pagination$]="pagination$"
  [actions]="actions"
  [pageSizeOptions]="[20, 50, 100]"
></ngbrx-paginator>
```

Thi input `pageSizeOptions` is optional and defaults to `[5, 10, 25, 100]`.

You have to replace the observable of the collection you used to iterate over the items by `pageItems$`:


```diff
<div class="list-group">
-  <div class="list-group-item" *ngFor="let item of collection$ | async">
+  <div class="list-group-item" *ngFor="let item of pageItems$ | async">
    {{ item.code }} {{ item.nom }}
  </div>
</div>
```
