import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Observable, Subscription, debounceTime, distinctUntilChanged, filter, map, merge, of, take, zip } from 'rxjs';
import { Pagination } from './paginator';
import { Action, DefaultProjectorFn, Store, createAction, props } from '@ngrx/store';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'lib-ngbrx-paginator',
  templateUrl: './ngbrx-paginator.component.html',
  styleUrls: ['./ngbrx-paginator.component.css']
})
export class NgbrxPaginatorComponent implements OnInit, OnDestroy {
  @Input({ required: true }) collection$: Observable<any[]> = EMPTY;
  @Input({ required: true }) pagination$: Observable<Pagination> = EMPTY;
  @Input({ required: true }) actions: any = null;
  @Input() filterSelector: DefaultProjectorFn<any> | null = null
  page: number = 1;
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
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  selectPage(page: string) {
    this.store.dispatch(this.actions.setPage({ page: parseInt(page, 10) || 1 }));
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
    this.store.dispatch(this.actions.setFilterQuery({ filter: this.filterValue }))
  }
}
