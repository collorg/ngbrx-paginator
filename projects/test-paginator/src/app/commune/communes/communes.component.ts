import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Commune } from '../commune.model';
import { NgbrxPaginatorService } from 'ngbrx-paginator';
import { Store } from '@ngrx/store';
import { CommuneActions } from '../commune.actions';
import { communes } from '../../data/communes';


@Component({
  selector: 'app-communes',
  templateUrl: './communes.component.html',
  styleUrls: ['./communes.component.css']
})
export class CommunesComponent {
  paginationKey = 'Communes';
  collection$: Observable<Commune[]> = this.paginationService.getPageItems$<Commune>(this.paginationKey);

  constructor(
    private paginationService: NgbrxPaginatorService,
    private store: Store
  ) {
    this.store.dispatch(CommuneActions.loadCommunes({communes}));
  }

}
