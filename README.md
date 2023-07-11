# NgbrxPaginator (BETA)

Easy reactive pagination with [ngrx](https://ngrx.io/) and [ng-bootstrap](https://ng-bootstrap.github.io). This package does not deal with backend pagination.

### Demo

https://collorg.github.io/ngbrx-paginator-demo

### Installation

```bash
yarn add ngbrx-paginator
```

ngbrx-paginator uses @ng-bootstrap/bootstrap and @ngrx/store.

## Usage

The example code is extracted from the [departement](./projects/test-paginator/src/app/departement) module

Add the `NgbrxPaginatorModule` in your [departement.module.ts](./projects/test-paginator/src/app/departement/departement.module.ts) dependencies:

```ts
import * as fromDepartement from './departement.reducer';
import { NgbrxPaginatorModule } from 'ngbrx-paginator';

@NgModule({
  [...]
  imports: [
    [...]
    NgbrxPaginatorModule.forFeature({
      paginators: [ // you can have as many paginators as you need per module
        {
          key: 'Departement/Pagination', // must be unique for the app
          byName: fromDepartement.byName,
          allDataSelector: fromDepartement.selectAll, // ngrx selector returning all the data set
          pageSizeOptions: [10, 20, 30] // defaults to [5, 10, 25, 100]
        }
      ]
    }),
    [...]
  ],
```

in your component class add the attributes `key`, and use NgbrxPaginationService to filter your collection by page:

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
  key = 'Departement/Pagination'; // same as in NgbrxPaginatorModules.forFeature
  pageItems$: Observable<Departement[]> = this.paginationService.getPageItems$<Departement>(this.key);
  filterQuery$: Observable<string> = this.paginationService.filterQuery$(this.key);
  numberOfFilteredItems$: Observable<number> = this.paginationService.numberOfFilteredItems$(this.key);

  constructor(
    private paginationService: NgbrxPaginatorService
  ) { }

}
```

And finally, use the ngbrx-paginator component in your [template](./projects/test-paginator/src/app/departement/departements/departements.component.html):

```html
<div class="card">
  <div class="card-header sticky-top">
    <h3>
      Liste des départements
      ({{ (numberOfFilteredItems$ | async) }}<span *ngIf="(filterQuery$ | async) as filter"> {{ filter }}</span>)
    </h3>
    <ngbrx-paginator
      [key]="key"
    ></ngbrx-paginator>
  </div>
  <div class="card-body">
    <div class="list-group">
      <div class="list-group-item" *ngFor="let item of pageItems$ | async">
        {{ item.code }} {{ item.nom }}
      </div>
    </div>
  </div>
</div>
```

