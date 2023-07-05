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
  collection$: Observable<Commune[]> = this.service.getPageItems$<Commune>(this.featureKey);

  constructor(
    private service: NgbrxPaginatorService
  ) { }

}
