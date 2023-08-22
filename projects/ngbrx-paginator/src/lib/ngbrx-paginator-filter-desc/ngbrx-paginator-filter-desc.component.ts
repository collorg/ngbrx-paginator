import { Component, Input, OnInit } from '@angular/core';
import { NgbrxPaginatorService } from '../ngbrx-paginator.service';
import { EMPTY, Observable, take, zip } from 'rxjs';

@Component({
  selector: 'ngbrx-paginator-filter-desc',
  templateUrl: './ngbrx-paginator-filter-desc.component.html',
  styleUrls: ['./ngbrx-paginator-filter-desc.component.css']
})
export class NgbrxPaginatorFilterDesc {
  @Input({ required: true }) key: string = '';

  constructor(
    private service: NgbrxPaginatorService
  ) { }

  get filterDesc(): string {
    let filterDesc = '';
    zip(
      this.service.currentFiltersDesc$(this.key),
      this.service.numberOfFilteredItems$(this.key)
    ).pipe(
      take(1),
    ).subscribe(([filter, numberOfItems]: [string, number]) => {
      filterDesc = `${filter} (${numberOfItems})`
    })
    return filterDesc;
  }
}
