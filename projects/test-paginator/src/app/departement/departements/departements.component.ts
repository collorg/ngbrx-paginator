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
  featureKey = 'Departement/Pagination';
  collection$: Observable<Departement[]> = this.paginationService.getPageItems$<Departement>(this.featureKey);
  filterValue$: Observable<string> = this.paginationService.filterValue$(this.featureKey);
  numberOfFilteredItems$: Observable<number> = this.paginationService.numberOfFilteredItems$(this.featureKey);
  constructor(
    private paginationService: NgbrxPaginatorService
  ) { }

}
