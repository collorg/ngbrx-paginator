import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DepartementActions } from './departement/departement.actions';
import { CommuneActions } from './commune/commune.actions';
import { departements } from './data/departements';
import { communes } from './data/communes'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test-paginator';

  constructor(
    private store: Store
  ) {
    this.store.dispatch(DepartementActions.loadDepartements({departements}));
    this.store.dispatch(CommuneActions.loadCommunes({communes}));
  }
}
