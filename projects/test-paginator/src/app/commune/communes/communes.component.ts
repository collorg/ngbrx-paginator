import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbrxPaginatorService } from 'ngbrx-paginator';
import { Commune } from '../commune.model';
import { Store } from '@ngrx/store';

import * as fromStore from '../commune.reducer';
import { CommuneService } from '../commune.service';

@Component({
  selector: 'app-communes',
  templateUrl: './communes.component.html',
  styleUrls: ['./communes.component.css']
})
export class CommunesComponent {
  paginationKey = 'Communes';
  collection$: Observable<Commune[]> = this.store.select(fromStore.selectAll);
  paginatedCollection$: Observable<Commune[]> = this.paginationService.setPaginator<Commune>(this.paginationKey, this.collection$);

  constructor(
    private paginationService: NgbrxPaginatorService,
    private store: Store,
    private service: CommuneService
  ) {
    this.service.load();
  }

}
