import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Observable, Subscription, filter, map, take, tap, zip } from 'rxjs';
import { Pagination } from './reducers';
import { Store } from '@ngrx/store';
import { FormControl } from '@angular/forms';
import * as fromStore from './reducers';
import { NgbrxPaginatorActions } from './reducers/ngbrx-paginator.actions';
import { NgbrxPaginatorService } from './ngbrx-paginator.service';


@Component({
  selector: 'ngbrx-paginator',
  templateUrl: './ngbrx-paginator.component.html',
  styleUrls: ['./ngbrx-paginator.component.css']
})
export class NgbrxPaginatorComponent implements OnInit, OnDestroy {
  @Input({required: true}) featureKey: string = '';
  collection$: Observable<any[]> = EMPTY;
  pagination$: Observable<Pagination> = EMPTY;
  pagesCount$: Observable<number> = EMPTY;
  hasFilter: boolean = false;
  page: number = 1;
  oldFilterValue: string = '';
  filterValue: string = '';
  FILTER_PAG_REGEX = /[^0-9]/g;
  subscriptions: Subscription[] = [];
  control = new FormControl();

  constructor(
    private store: Store,
    private service: NgbrxPaginatorService
  ) {
  }

  ngOnInit(): void {
    this.collection$ = this.store.select(fromStore.selectFilteredCollection(this.featureKey));
    this.pagination$ = this.store.select(fromStore.selectPagination(this.featureKey));
    this.pagesCount$ = this.store.select(fromStore.selectPagesCount(this.featureKey));
    this.hasFilter = this.service.hasFilter(this.featureKey);
    this.subscriptions.push(this.pagination$.subscribe((pagination) => this.filterValue = pagination.filter))
  }

  ngOnDestroy(): void {
  }

  changePage(page: number) {
    this.store.dispatch(NgbrxPaginatorActions.setPage({ featureKey: this.featureKey, page }));
    this.page = page;
  }

  setPage(page: string) {
    let pageInt = parseInt(page, 10) || 1;
    this.pagesCount$.pipe(
      take(1),
      tap((pagesCount: number) => {
        pageInt = Math.min(pageInt, pagesCount);
        pageInt !== this.page && this.changePage(pageInt);
      })
    ).subscribe();
  }

  setPageSize(pageSize: number) {
    this.store.dispatch(NgbrxPaginatorActions.setPageSize({ featureKey: this.featureKey, pageSize }));
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(this.FILTER_PAG_REGEX, '');
  }

  setFilterValue() {
    if (this.filterValue !== this.oldFilterValue) {
      this.store.dispatch(NgbrxPaginatorActions.setFilterQuery({ featureKey: this.featureKey, filter: this.filterValue }));
      this.oldFilterValue = this.filterValue;
    }
  }
}
