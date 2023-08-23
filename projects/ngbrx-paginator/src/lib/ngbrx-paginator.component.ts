import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Observable, Subscription, map } from 'rxjs';
import { Pagination } from './ngbrx-paginator.model';
import { FormControl } from '@angular/forms';
import { NgbrxPaginatorService } from './ngbrx-paginator.service';


@Component({
  selector: 'ngbrx-paginator',
  templateUrl: './ngbrx-paginator.component.html',
  styleUrls: ['./ngbrx-paginator.component.css']
})
export class NgbrxPaginatorComponent implements OnInit, OnDestroy {
  @Input({ required: true }) key: string = '';
  collection$: Observable<any[]> = EMPTY;
  pagination$: Observable<Pagination> = EMPTY;
  pagesCount$: Observable<number> = EMPTY;
  filters$: Observable<string[]> = EMPTY;
  currentFilter$: Observable<number> = EMPTY;
  filterQueries$: Observable<string[]> = EMPTY;
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
    this.collection$ = this.service.filteredCollection$(this.key);
    this.filters$ = this.service.filters$(this.key);
    this.pagination$ = this.service.pagination$(this.key);
    this.pagesCount$ = this.service.pagesCount$(this.key);
    this.currentFilter$ = this.service.currentFilter$(this.key);
    this.filterQueries$ = this.service.filterQueries$(this.key);
    this.hasFilter = this.service.hasFilter(this.key);
    this.subscriptions.push(this.pagination$.subscribe((pagination) => this.page = pagination.page))
    this.subscriptions.push(this.filters$.subscribe((filters) => {
      this.filters = filters;
    }))
    this.subscriptions.push(
      this.service.currentFilter$(this.key).subscribe((currentFilter) => this.currentFilter = currentFilter))
    this.subscriptions.push(this.filterQueries$.subscribe((filterQueries: string[]) => this.filterQueries = filterQueries));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  changePage(page: number) {
    this.page = this.service.setPage(this.key, page)
  }

  setPage(page: string) {
    this.changePage(parseInt(page, 10) || 1)
  }

  setPageSize(pageSize: number) {
    this.service.setPageSize(this.key, pageSize);
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
    this.service.setCurrentFilter(this.key, filterIdx);
  }

  getFilterValues$(filterKey: string): Observable<any> {
    return this.service.getFilterValues$(this.key, filterKey);
  }

  isFilteredValue$(filterIdx: number, value: any): Observable<boolean> {
    return this.getFilterQuery$(filterIdx).pipe(
      map((query: string) => value === query)
    )
  }

  setFilterQuery(event: any) {
    const query = event.target.value;
    this.service.setFilterQuery(this.key, query);
    this.changePage(1)
  }

  setSelectedOption(event: any) {
    this.service.setFilterQuery(this.key, event.target.value);
    this.changePage(1)
  }

  setFilterKey(filterIdx: number) {
    this.service.setCurrentFilter(this.key, filterIdx);
  }

  toggleShowFilters() {
    this.showFilters = !this.showFilters;
  }

  isActivated$(filterIdx: number) {
    return this.service.isActivated$(this.key, filterIdx)
  }

}
