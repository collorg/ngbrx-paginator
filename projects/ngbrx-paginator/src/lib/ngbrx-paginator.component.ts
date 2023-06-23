import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Observable, Subscription, filter, map, take } from 'rxjs';
import { Pagination } from './model';
import { DefaultProjectorFn, Store, createAction, props } from '@ngrx/store';


@Component({
  selector: 'lib-ngbrx-paginator',
  templateUrl: './ngbrx-paginator.component.html',
  styleUrls: ['./ngbrx-paginator.component.css']
})
export class NgbrxPaginatorComponent  implements OnInit, OnDestroy {
  @Input({ required: true }) collection$: Observable<any[]> = EMPTY;
  @Input({ required: true }) pagination$: Observable<Pagination> = EMPTY;
  @Input({ required: true }) actionPrefix: string = '';
  @Input() filterSelector: DefaultProjectorFn<any> | null = null
  #setPage: any;
  #setPageSize: any;
  #filterCollection: any;
  filterValue$: Observable<string> = EMPTY;
  page: number = 1;
  filterValue: string = '';
  FILTER_PAG_REGEX = /[^0-9]/g;
  subscriptions: Subscription[] = [];

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.#setPage = createAction(`${this.actionPrefix} Set Page`, props<{ page: number }>());
    this.#setPageSize = createAction(`${this.actionPrefix} Set Page Size`, props<{ pageSize: number }>());
    this.#filterCollection = createAction(`${this.actionPrefix} Filter Collection`, props<{ filter: string }>());
    if (this.filterSelector !== null) {
      this.filterValue$ = this.store.select(this.filterSelector);
      this.filterValue$.pipe(take(1)).subscribe((filter: string) => this.filterValue = filter);
    }
    this.subscriptions.push(this.pagination$.pipe(
      filter((pagination: Pagination) => pagination !== undefined)
    ).subscribe((pagination: Pagination) => this.page = pagination.page));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  selectPage(page: string) {
    this.store.dispatch(this.#setPage({ page: parseInt(page, 10) || 1 }));
  }

  setPageSize(pageSize: number) {
    this.store.dispatch(this.#setPageSize({ pageSize }));
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(this.FILTER_PAG_REGEX, '');
  }

  filter() {
    this.store.dispatch(this.#filterCollection({ filter: this.filterValue }));
  }

  numberOfPages$(): Observable<number> {
    return this.pagination$.pipe(
      map((pagination: Pagination) => Math.round(pagination.collectionSize / pagination.pageSize) || 1)
    )
  }


}
