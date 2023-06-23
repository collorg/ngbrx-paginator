import { Component } from '@angular/core';
import { departements } from '../../data/departements';
import { Store } from '@ngrx/store';
import { DepartementActions } from '../departement.actions';

@Component({
  selector: 'app-departements',
  templateUrl: './departements.component.html',
  styleUrls: ['./departements.component.css']
})
export class DepartementsComponent {
  constructor(
    private store: Store
  ) {
    this.store.dispatch(DepartementActions.loadDepartements({departements}))
  }
}
