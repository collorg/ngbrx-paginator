import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Commune } from '../commune.model';
import { NgbrxPaginatorService } from 'ngbrx-paginator';

@Component({
  selector: 'app-communes',
  templateUrl: './communes.component.html',
  styleUrls: ['./communes.component.css']
})
export class CommunesComponent {
  featureKey = 'Commune/Pagination';
  collection$: Observable<Commune[]> = this.paginationService.getPageItems$<Commune>(this.featureKey);
  filterValue$: Observable<string> = this.paginationService.filterValue$(this.featureKey);
  numberOfFilteredItems$: Observable<number> = this.paginationService.numberOfFilteredItems$(this.featureKey);

  constructor(
    private paginationService: NgbrxPaginatorService
  ) { }

}
