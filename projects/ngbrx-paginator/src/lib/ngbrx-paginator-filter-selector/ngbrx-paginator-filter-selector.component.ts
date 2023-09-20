import { Component, Input, OnInit } from '@angular/core';
import { NgbrxPaginatorService } from '../ngbrx-paginator.service';
import { EMPTY, Observable, take } from 'rxjs';

@Component({
  selector: 'ngbrx-paginator-filter-selector',
  templateUrl: './ngbrx-paginator-filter-selector.component.html',
  styleUrls: ['./ngbrx-paginator-filter-selector.component.css']
})
export class NgbrxPaginatorFilterSelectorComponent implements OnInit {
  @Input({ required: true }) key: string = '';
  @Input() extension: string | undefined = '';
  fullKey = '';
  filters$: Observable<string[]> = EMPTY;
  currentFilter$: Observable<number> = EMPTY;
  activatedFilters$: Observable<number[]> = EMPTY;
  filterQueries$: Observable<string[]> = EMPTY;
  filterName: string = '';

  constructor(
    private service: NgbrxPaginatorService
  ) { }

  ngOnInit(): void {
    this.fullKey = this.service.getKey(this.key, this.extension);
    this.filters$ = this.service.filters$(this.fullKey);
    this.currentFilter$ = this.service.currentFilter$(this.fullKey);
    this.activatedFilters$ = this.service.activatedFilters$(this.fullKey);
    this.filterQueries$ = this.service.filterQueries$(this.fullKey);
  }

  toggleActivation(filterIdx: number) {
    this.service.toggleActivatedFilter(this.fullKey, filterIdx)
  }

  isActivated(filterIdx: number): boolean {
    let isActivated = false;
    this.service.isActivated$(this.fullKey, filterIdx).pipe(take(1)).subscribe((activated) => isActivated = activated);
    return isActivated;
  }

  isCurrent(filterIdx: number): boolean {
    let isCurrent = false;
    this.currentFilter$.pipe(take(1)).subscribe((current) => isCurrent = current === filterIdx);
    return isCurrent;
  }

  query(filterIdx: number): string {
    let query = '';
    this.filterQueries$.pipe(take(1)).subscribe((queries: string[]) => query = queries[filterIdx]);
    return query;
  }

  filterValue$ = (filterIdx: number) => this.service.filterValue$(this.fullKey, filterIdx);

}
