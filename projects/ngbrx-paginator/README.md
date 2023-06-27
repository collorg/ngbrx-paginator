# NgbrxPaginator

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.0.

## Code scaffolding

Run `ng generate component component-name --project ngbrx-paginator` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project ngbrx-paginator`.
> Note: Don't forget to add `--project ngbrx-paginator` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build ngbrx-paginator` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build ngbrx-paginator`, go to the dist folder `cd dist/ngbrx-paginator` and run `npm publish`.

## Running unit tests

Run `ng test ngbrx-paginator` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Usage (example with an EntityState)

In your feature reducer, add:

```ts
import { Pagination, initialPagination } from 'ngbrx-paginator';

export interface State extends EntityState<MyData> {
  pagination: Pagination,
  filterValue: string
}

export const adapter: EntityAdapter<MyData> = createEntityAdapter<MyData>();

export const initialState: State = {
  pagination: initialPagination,
  filterValue: ''
};
```

Add to actions:

```ts
export const DepartementActionsPrefix = 'Departement/API';

let actions = createActionGroup({
    // [...]
}

export const DepartementActions = paginator.addPaginationActions(DepartementActionsPrefix, actions);

```

Add

```ts

  on(DepartementActions.setFilterQuery, (state, { filter }) => {
    return { ...state, filterValue: filter };
  }),
  on(DepartementActions.setFilteredCollectionSize, (state, { size }) => {
    let pagination = { ...state.pagination };
    pagination.collectionSize = size;
    pagination.pagesCount = paginator.getPagesCount(pagination);
    return { ...state, pagination };
  })

```
