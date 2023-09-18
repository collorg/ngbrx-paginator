import { Component, AfterViewChecked } from '@angular/core';
import { Store } from '@ngrx/store';
import { DepartementActions } from './departement/departement.actions';
import { departements } from './data/departements';
import { NgbrxPaginatorService } from 'ngbrx-paginator';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked {
  title = 'test-paginator';
  paginatorKeys$: Observable<string[]> = EMPTY;

  constructor(
    private store: Store,
    private paginationService: NgbrxPaginatorService
  ) {
    this.store.dispatch(DepartementActions.loadDepartements({departements}));
  }
  
  ngAfterViewChecked(): void {
    this.paginatorKeys$ = this.paginationService.paginatorKeys$;
  }

}
