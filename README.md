# NgbrxPaginator (BETA)

Easy reactive pagination with [ngrx](https://ngrx.io/) and [ng-bootstrap](https://ng-bootstrap.github.io). This package does not deal with backend pagination.

### Demo

https://collorg.github.io/ngbrx-paginator-demo

### Installation

```bash
yarn add ngbrx-paginator
```


## Usage

The example code is extracted from the [departement](./projects/test-paginator/src/app/departement) module

Add the `NgbrxPaginatorModule` in your [departement.module.ts](./projects/test-paginator/src/app/departement/departement.module.ts) dependencies:

```ts
import * as fromDepartement from './departement.reducer';
import { NgbrxPaginatorModule } from 'ngbrx-paginator';
import { NgbrxPaginatorModule } from 'ngbrx-paginator';

@NgModule({
  [...]
  imports: [
    [...]
    NgbrxPaginatorModule.forFeature({
      featureKey: 'Departement/Pagination', // must be unique for the app
      filterFunction: fromDepartement.filterFunction,
      allDataSelector: fromDepartement.selectAll,
      pageSizeOptions: [10, 20, 30] // defaults to [5, 10, 25, 100]
    }),
    [...]
  ],
```

in your component class add the attributes `featureKey`, and use NgbrxPaginationService to filter your collection by page:

```ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Departement } from '../departement.model';
import { NgbrxPaginatorService } from 'ngbrx-paginator';

@Component({
  selector: 'app-departements',
  templateUrl: './departements.component.html',
  styleUrls: ['./departements.component.css']
})
export class DepartementsComponent {
  featureKey = 'Departement/Pagination'; // same as in NgbrxPaginatorModules.forFeature
  collection$: Observable<Departement[]> = this.paginationService.getPageItems$<Departement>(this.featureKey);

  constructor(
    private paginationService: NgbrxPaginatorService
  ) { }

}
```

And finally, use the ngbrx-paginator component in your [template](./projects/test-paginator/src/app/departement/departements/departements.component.html):

```html
    <ngbrx-paginator
      [featureKey]="featureKey"
    ></ngbrx-paginator>
```

