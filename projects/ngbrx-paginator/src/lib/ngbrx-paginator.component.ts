import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Observable, Subscription, filter, map, take, tap, zip } from 'rxjs';
import { Pagination } from './paginator';
import { DefaultProjectorFn, Store } from '@ngrx/store';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'ngbrx-paginator',
  templateUrl: './ngbrx-paginator.component.html',
  styleUrls: ['./ngbrx-paginator.component.css']
})
export class NgbrxPaginatorComponent implements OnInit, OnDestroy {
  @Input({ required: true }) collection$: Observable<any[]> = EMPTY;
  @Input({ required: true }) pagination$: Observable<Pagination> = EMPTY;
  @Input({ required: true }) actions: any = null;
  @Input() filterSelector: DefaultProjectorFn<any> | null = null;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  page: number = 1;
  oldFilterValue: string = '';
  filterValue: string = '';
  FILTER_PAG_REGEX = /[^0-9]/g;
  subscriptions: Subscription[] = [];
  control = new FormControl();

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.pagination$.pipe(
      filter((pagination: Pagination) => pagination !== undefined)
    ).subscribe((pagination: Pagination) => {
      this.filterValue = pagination.filter;
      this.page = pagination.page;
      if (!pagination.pageSize) {
        this.store.dispatch(this.actions.setPageSize({pageSize: this.pageSizeOptions[0]}));
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  changePage(page: number) {
    this.store.dispatch(this.actions.setPage({ page }));
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
    this.store.dispatch(this.actions.setPageSize({ pageSize }));
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(this.FILTER_PAG_REGEX, '');
  }

  get pagesCount$(): Observable<number> {
    return zip(this.collection$, this.pagination$).pipe(
      map(([collection, pagination]) => Math.floor(collection.length / pagination.pageSize) + 1)
    )
  }

  setFilterValue() {
    if (this.filterValue !== this.oldFilterValue) {
      this.store.dispatch(this.actions.setFilterQuery({ filter: this.filterValue }));
      this.oldFilterValue = this.filterValue;
    }
  }
}
