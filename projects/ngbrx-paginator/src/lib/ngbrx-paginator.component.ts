import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Observable, Subscription, debounceTime, distinctUntilChanged, filter, map, take } from 'rxjs';
import { Pagination } from './paginator';
import { Action, DefaultProjectorFn, Store, createAction, props } from '@ngrx/store';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'lib-ngbrx-paginator',
  templateUrl: './ngbrx-paginator.component.html',
  styleUrls: ['./ngbrx-paginator.component.css']
})
export class NgbrxPaginatorComponent  implements OnInit, OnDestroy {
  @Input({ required: true }) collection$: Observable<any[]> = EMPTY;
  @Input({ required: true }) pagination$: Observable<Pagination> = EMPTY;
  @Input({ required: true }) actions: any = null;
  @Input() filterSelector: DefaultProjectorFn<any> | null = null
  #setPage: any;
  #setPageSize: any;
  filterValue$: Observable<string> = EMPTY;
  page: number = 1;
  filterValue: string = '';
  FILTER_PAG_REGEX = /[^0-9]/g;
  subscriptions: Subscription[] = [];
  control = new FormControl();

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.#setPage = this.actions.setPage;
    this.#setPageSize = this.actions.setPageSize;
    if (this.filterSelector !== null) {
      this.filterValue$ = this.store.select(this.filterSelector);
      this.filterValue$.pipe(take(1)).subscribe((filter: string) => this.filterValue = filter);
    }
    this.subscriptions.push(this.pagination$.pipe(
      filter((pagination: Pagination) => pagination !== undefined)
    ).subscribe((pagination: Pagination) => this.page = pagination.page));
    this.subscriptions.push(this.control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((input: string) => {
      this.store.dispatch(this.actions.filterCollection({ filter: this.filterValue }));
    }))
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

  numberOfPages$(): Observable<number> {
    return this.pagination$.pipe(
      map((pagination: Pagination) => Math.round(pagination.collectionSize / pagination.pageSize) || 1)
    )
  }

}
