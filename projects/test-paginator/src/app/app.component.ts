import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DepartementActions } from './departement/departement.actions';
import { departements } from './data/departements';
import { NgbrxPaginatorService } from 'ngbrx-paginator';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test-paginator';
  paginatorKeys$: Observable<string[]> = this.paginationService.paginatorKeys$;

  constructor(
    private store: Store,
    private paginationService: NgbrxPaginatorService
  ) {
    this.store.dispatch(DepartementActions.loadDepartements({departements}));
  }
}
