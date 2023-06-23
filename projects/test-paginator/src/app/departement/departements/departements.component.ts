import { Component } from '@angular/core';
import { departements } from '../../data/departements';
import { Store } from '@ngrx/store';
import { DepartementActions } from '../departement.actions';
import { Observable } from 'rxjs';
import { Departement } from '../departement.model';
import * as fromStore from '../departement.reducer';

@Component({
  selector: 'app-departements',
  templateUrl: './departements.component.html',
  styleUrls: ['./departements.component.css']
})
export class DepartementsComponent {
  collection$: Observable<Departement[]> = this.store.select(fromStore.departementsFeature.selectAll)
  constructor(
    private store: Store
  ) {
    this.store.dispatch(DepartementActions.loadDepartements({departements}))
  }
}
