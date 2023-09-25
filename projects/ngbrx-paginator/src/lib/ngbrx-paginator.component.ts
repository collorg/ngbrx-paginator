import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Observable, Subscription, map } from 'rxjs';
import { Pagination } from './ngbrx-paginator.model';
import { FormControl } from '@angular/forms';
import { NgbrxPaginatorService } from './ngbrx-paginator.service';


@Component({
  selector: 'ngbrx-paginator',
  templateUrl: './ngbrx-paginator.component.html',
  styleUrls: ['./ngbrx-paginator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgbrxPaginatorComponent implements OnInit, OnDestroy {
  @Input({ required: true }) key: string = '';
  @Input() extension: string | undefined;
  fullKey = this.key;
  collection$: Observable<any[]> = EMPTY;
  pagination$: Observable<Pagination> = EMPTY;
  pagesCount$: Observable<number> = EMPTY;
  filters$: Observable<string[]> = EMPTY;
  currentFilter$: Observable<number> = EMPTY;
  filterQueries$: Observable<string[]> = EMPTY;
  filterValues$: Observable<string[]> = EMPTY;
  filterIdx: number = -1;
  filterKeys: string[] = [];
  currentFilter: number = -1;
  filterQueries: string[] = [];
  hasFilter: boolean = false;
  page: number = 1;
  FILTER_PAG_REGEX = /[^0-9]/g;
  subscriptions: Subscription[] = [];
  showFilters: boolean = false;
  control = new FormControl();
  filters: string[] = [];

  constructor(
    private service: NgbrxPaginatorService
  ) {
  }

  ngOnInit(): void {
    this.fullKey = this.service.getKey(this.key, this.extension);
    this.collection$ = this.service.filteredCollection$(this.fullKey);
    this.filters$ = this.service.filters$(this.fullKey);
    this.pagination$ = this.service.pagination$(this.fullKey);
    this.pagesCount$ = this.service.pagesCount$(this.fullKey);
    this.currentFilter$ = this.service.currentFilter$(this.fullKey);
    this.filterQueries$ = this.service.filterQueries$(this.fullKey);
    this.filterValues$ = this.service.filterValues$(this.fullKey);
    this.hasFilter = this.service.hasFilter(this.fullKey);
    this.subscriptions.push(this.pagination$.subscribe((pagination) => this.page = pagination.page))
    this.subscriptions.push(this.filters$.subscribe((filters) => this.filters = filters))
    this.subscriptions.push(
      this.service.currentFilter$(this.fullKey).subscribe((currentFilter) => this.currentFilter = currentFilter))
    this.subscriptions.push(this.filterQueries$.subscribe((filterQueries: string[]) => this.filterQueries = filterQueries));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  changePage(page: number) {
    this.page = this.service.setPage(this.fullKey, page)
  }

  setPage(page: string) {
    this.changePage(parseInt(page, 10) || 1)
  }

  setPageSize(pageSize: number) {
    this.service.setPageSize(this.fullKey, pageSize);
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(this.FILTER_PAG_REGEX, '');
  }

  getFilterQuery$(filterIdx: number): Observable<string> {
    return this.filterQueries$.pipe(
      map((filterQueries: string[]) => filterQueries[filterIdx])
    )
  }

  setCurrentFilter(filterIdx: number) {
    this.filterIdx = filterIdx;
    this.service.setCurrentFilter(this.fullKey, filterIdx);
  }


  isFilteredValue$(filterIdx: number, value: any): Observable<boolean> {
    return this.getFilterQuery$(filterIdx).pipe(
      map((query: string) => value === query)
    )
  }

  setFilterQuery(event: any) {
    this.service.setFilterQuery(this.fullKey, event.target.value);
    this.changePage(1)
  }

  setSelectedOption(event: any) {
    let value = '';
    const val = JSON.parse(event.target.value)
    this.service.setFilterQuery(this.fullKey, val.key, val.value);
    this.changePage(1)
  }

  setFilterKey(filterIdx: number) {
    this.filterIdx = filterIdx;
    this.service.setCurrentFilter(this.fullKey, filterIdx);
  }

  toggleShowFilters() {
    this.showFilters = !this.showFilters;
  }

  isActivated$(filterIdx: number) {
    return this.service.isActivated$(this.fullKey, filterIdx)
  }

  stringify(object: any) {
    return JSON.stringify(object)
  }

  getFilterValues$ = (filterKey: string): Observable<any> => this.service.getFilterValues$(this.fullKey, filterKey);
  filterValue$ = (filterIdx: number) => this.service.filterValue$(this.fullKey, filterIdx);

  getEntries(values: {[key: string]: string}): {key: string, value: string}[] {
    const res: {key: string, value: string}[] = [];
    Object.keys(values).forEach(
      (key: string) => res.push({key, value: values[key]})
    )
    return res;
  }
}
