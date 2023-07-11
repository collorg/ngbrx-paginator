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
  key = 'Departement/Pagination';
  collection$: Observable<Departement[]> = this.paginationService.getPageItems$<Departement>(this.key);
  filterQuery$: Observable<string> = this.paginationService.filterQuery$(this.key);
  numberOfFilteredItems$: Observable<number> = this.paginationService.numberOfFilteredItems$(this.key);
  constructor(
    private paginationService: NgbrxPaginatorService
  ) {
    this.paginationService.setCurrent(this.key);
  }

}
