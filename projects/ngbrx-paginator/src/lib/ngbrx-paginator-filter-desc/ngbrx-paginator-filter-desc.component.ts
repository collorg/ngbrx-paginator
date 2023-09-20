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
  @Input() extension: string | undefined = '';
  fullKey = '';
  @Input() showNumberOfItems = true;
  filters$: Observable<string[]> = EMPTY;
  queries$: Observable<string[]> = EMPTY;
  values$: Observable<string[]> = EMPTY;
  actviatedFilters$: Observable<number[]> = EMPTY;
  numberOfItems$: Observable<number> = EMPTY;

  constructor(
    private service: NgbrxPaginatorService
  ) { }

  ngOnInit(): void {
    this.fullKey = this.service.getKey(this.key, this.extension);
    this.filters$ = this.service.filters$(this.fullKey);
    this.queries$ = this.service.filterQueries$(this.fullKey);
    this.values$ = this.service.filterValues$(this.fullKey);
    this.numberOfItems$ = this.service.numberOfFilteredItems$(this.fullKey);
    this.actviatedFilters$ = this.service.activatedFilters$(this.fullKey);
  }

  isActivated$ = (key: string, idx: number) => this.service.isActivated$(key, idx);

}
