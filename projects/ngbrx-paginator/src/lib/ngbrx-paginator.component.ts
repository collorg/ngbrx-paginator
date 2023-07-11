import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Observable, Subscription } from 'rxjs';
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
  currentFilter: string = '';
  filterKeys: string[] = [];
  hasFilter: boolean = false;
  page: number = 1;
  filterQuery: string = '';
  FILTER_PAG_REGEX = /[^0-9]/g;
  subscriptions: Subscription[] = [];
  control = new FormControl();

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
    this.hasFilter = this.service.hasFilter(this.key);
    this.subscriptions.push(this.service.filterQuery$(this.key).subscribe((filterQuery) => this.filterQuery = filterQuery))
    this.subscriptions.push(this.filterQueries$.subscribe((filterQueries) => this.filterKeys = Object.keys(filterQueries)))
    this.subscriptions.push(this.currentFilter$.subscribe((currentFilter) => this.currentFilter = currentFilter))
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

  setCurrentFilter(filterKey: string) {
    this.service.setCurrentFilter(this.key, filterKey);
  }

  setFilterValue() {
    this.service.setFilterQuery(this.key, this.filterQuery);
    this.changePage(1)
  }

}
