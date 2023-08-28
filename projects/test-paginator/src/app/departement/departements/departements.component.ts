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
  paginationKey = 'Departements';
  collection$: Observable<Departement[]> = this.paginationService.getPageItems$<Departement>(this.paginationKey);

  constructor(
    private paginationService: NgbrxPaginatorService
  ) { }

}
