import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Observable, Subscription, map, take } from 'rxjs';
import { Pagination } from './reducers';
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
  currentFilter$: Observable<string> = EMPTY;
  filterQueries$: Observable<{ [key: string]: string }> = EMPTY;
  selectedFilters$: Observable<string[]> = EMPTY;
  filterKeys: string[] = [];
  currentFilter: string = '';
  filterQueries: { [key: string]: string } = {};
  hasFilter: boolean = false;
  page: number = 1;
  FILTER_PAG_REGEX = /[^0-9]/g;
  subscriptions: Subscription[] = [];
  control = new FormControl();
  selectedFilters: string[] = [];

  constructor(
    private service: NgbrxPaginatorService
  ) {
  }

  ngOnInit(): void {
    this.collection$ = this.service.filteredCollection$(this.key);
    this.pagination$ = this.service.pagination$(this.key);
    this.pagesCount$ = this.service.pagesCount$(this.key);
    this.currentFilter$ = this.service.currentFilter$(this.key);
    this.filterQueries$ = this.service.filterQueries$(this.key);
    this.selectedFilters$ = this.service.selectedFilters$(this.key);
    this.hasFilter = this.service.hasFilter(this.key);
    this.subscriptions.push(this.service.currentFilter$(this.key).subscribe((currentFilter) => this.currentFilter = currentFilter))
    this.subscriptions.push(this.filterQueries$.subscribe((filterQueries) => {
      this.filterKeys = Object.keys(filterQueries);
      this.filterQueries = filterQueries;
    }))
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

  getFilterQuery$(filterKey: string) {
    return this.filterQueries$.pipe(
      map((filterQueries: { [key: string]: string }) => filterQueries[filterKey])
    )
  }

  setCurrentFilter(filterKey: string) {
    this.service.setCurrentFilter(this.key, filterKey);
  }

  setFilterQuery(id: string) {
    const query = (<HTMLInputElement>document.getElementById(id))?.value;
    if (query || this.selectedFilters) {
      this.service.setFilterQuery(this.key, query);
      this.changePage(1)
    }
  }

  setFilterKey(filterKey: string) {
    this.service.setCurrentFilter(this.key, filterKey);
  }

  toggleSelectedFilterKey(filterKey: string) {
    this.service.selectFilter(this.key, filterKey);
  }

  isChecked$(filterKey: string): Observable<string> {
    return this.selectedFilters$.pipe(
      map((selectedFilters: string[]) => selectedFilters.indexOf(filterKey) > -1 && 'checked' || '')
    )
  }

}
