import { Component, Input, OnInit } from '@angular/core';
import { NgbrxPaginatorService } from '../ngbrx-paginator.service';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'ngbrx-paginator-filter-desc',
  templateUrl: './ngbrx-paginator-filter-desc.component.html',
  styleUrls: ['./ngbrx-paginator-filter-desc.component.css']
})
export class NgbrxPaginatorFilterDesc implements OnInit {
  @Input({ required: true }) key: string = '';
  @Input() showNumberOfItems = true;
  filters$: Observable<string[]> = EMPTY;
  queries$: Observable<string[]> = EMPTY;
  actviatedFilters$: Observable<number[]> = EMPTY;
  numberOfItems$: Observable<number> = EMPTY;

  constructor(
    private service: NgbrxPaginatorService
  ) { }

  ngOnInit(): void {
    this.filters$ = this.service.filters$(this.key);
    this.queries$ = this.service.filterQueries$(this.key);
    this.numberOfItems$ = this.service.numberOfFilteredItems$(this.key);
    this.actviatedFilters$ = this.service.activatedFilters$(this.key);
  }

  isActivated$ = (key: string, idx: number) => this.service.isActivated$(key, idx);

}
