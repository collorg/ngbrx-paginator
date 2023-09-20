import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Departement } from '../departement.model';
import { NgbrxPaginatorService } from 'ngbrx-paginator';
import * as fromStore from '../departement.reducer';
import { DepartementService } from '../departement.service';

@Component({
  selector: 'app-departements',
  templateUrl: './departements.component.html',
  styleUrls: ['./departements.component.css']
})
export class DepartementsComponent {
  paginationKey = 'Departements';
  extension = 'xyz';
  collection$: Observable<Departement[]> = this.store.select(fromStore.selectAll);
  paginatedCollection$: Observable<Departement[]> = this.paginationService.setPaginator<Departement>(this.paginationKey, this.collection$, this.extension);

  constructor(
    private paginationService: NgbrxPaginatorService,
    private service: DepartementService,
    private store: Store<fromStore.State>
  ) {
    this.service.load();
  }

}
