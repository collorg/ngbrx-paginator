import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Observable, Subscription, filter, map, take, tap, zip } from 'rxjs';
import { Pagination } from './reducers';
import { FormControl } from '@angular/forms';
import { NgbrxPaginatorService } from './ngbrx-paginator.service';


@Component({
  selector: 'ngbrx-paginator',
  templateUrl: './ngbrx-paginator.component.html',
  styleUrls: ['./ngbrx-paginator.component.css']
})
export class NgbrxPaginatorComponent implements OnInit {
  @Input({required: true}) featureKey: string = '';
  collection$: Observable<any[]> = EMPTY;
  pagination$: Observable<Pagination> = EMPTY;
  pagesCount$: Observable<number> = EMPTY;
  hasFilter: boolean = false;
  page: number = 1;
  filterValue: string = '';
  FILTER_PAG_REGEX = /[^0-9]/g;
  subscriptions: Subscription[] = [];
  control = new FormControl();

  constructor(
    private service: NgbrxPaginatorService
  ) {
  }

  ngOnInit(): void {
    this.collection$ = this.service.filteredCollection$(this.featureKey);
    this.pagination$ = this.service.pagination$(this.featureKey);
    this.pagesCount$ = this.service.pagesCount$(this.featureKey);
    this.hasFilter = this.service.hasFilter(this.featureKey);
    this.subscriptions.push(this.pagination$.subscribe((pagination) => this.filterValue = pagination.filter))
  }

  changePage(page: number) {
    this.page = this.service.setPage(this.featureKey, page)
  }

  setPage(page: string) {
    this.changePage(parseInt(page, 10) || 1)
  }

  setPageSize(pageSize: number) {
    this.service.setPageSize(this.featureKey, pageSize);
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(this.FILTER_PAG_REGEX, '');
  }

  setFilterValue() {
    this.service.setFilterQuery(this.featureKey, this.filterValue);
  }
}
