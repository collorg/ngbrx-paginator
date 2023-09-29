import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, distinctUntilChanged, map, tap } from 'rxjs';
import { Pagination } from './ngbrx-paginator.model';
import { FormControl } from '@angular/forms';
import { NgbrxPaginatorService } from './ngbrx-paginator.service';


@Component({
  selector: 'ngbrx-paginator',
  templateUrl: './ngbrx-paginator.component.html',
  styleUrls: ['./ngbrx-paginator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgbrxPaginatorComponent implements OnInit {
  @Input({ required: true }) key: string = '';
  @Input() extension: string | undefined;

  #searchTimeoutId: any = 0;
  #showFilters: boolean = false;
  #showFiltersSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.#showFilters);
  showFilters$: Observable<boolean> = this.#showFiltersSubject.asObservable();
  fullKey = this.key;
  collection$: Observable<any[]> = EMPTY;
  pagination$: Observable<Pagination> = EMPTY;
  filters$: Observable<string[]> = EMPTY;
  currentFilter$: Observable<number> = EMPTY;
  filterQueries$: Observable<string[]> = EMPTY;
  filterValues$: Observable<string[]> = EMPTY;
  filterIdx: number = -1;
  filterKeys: string[] = [];
  currentFilter: number = -1;
  filterQueries: string[] = [];
  hasFilter: boolean = false;
  control = new FormControl();

  constructor(
    private service: NgbrxPaginatorService
  ) {
  }

  ngOnInit(): void {
    this.fullKey = this.service.getKey(this.key, this.extension);
    this.collection$ = this.service.filteredCollection$(this.fullKey);
    this.filters$ = this.service.filters$(this.fullKey);
    this.pagination$ = this.service.pagination$(this.fullKey).pipe(
      distinctUntilChanged()
    );
    this.currentFilter$ = this.service.currentFilter$(this.fullKey).pipe(
      distinctUntilChanged(),
      tap(currentFilter => this.currentFilter = currentFilter)
    );
    this.filterQueries$ = this.service.filterQueries$(this.fullKey).pipe(
      distinctUntilChanged(),
      tap(filterQueries => this.filterQueries = filterQueries)
    );
    this.filterValues$ = this.service.filterValues$(this.fullKey);
    this.hasFilter = this.service.hasFilter(this.fullKey);
  }

  setPageSize(pageSize: number) {
    this.service.setPageSize(this.fullKey, pageSize);
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
    if (this.#searchTimeoutId) {
      clearTimeout(this.#searchTimeoutId);
    }
    this.#searchTimeoutId = setTimeout(() => {
      this.service.setFilterQuery(this.fullKey, event.target.value)
      , 333
    })
  }

  setSelectedOption(event: any) {
    let value = '';
    const val = JSON.parse(event.target.value)
    this.service.setFilterQuery(this.fullKey, val.key, val.value);
    this.service.setPage(this.fullKey, 1)
  }

  setFilterKey(filterIdx: number) {
    this.filterIdx = filterIdx;
    this.service.setCurrentFilter(this.fullKey, filterIdx);
  }

  toggleShowFilters() {
    this.#showFilters = !this.#showFilters;
    this.#showFiltersSubject.next(this.#showFilters);
  }

  isActivated$(filterIdx: number) {
    return this.service.isActivated$(this.fullKey, filterIdx)
  }

  stringify(object: any) {
    return JSON.stringify(object)
  }

  getFilterValues$ = (filterKey: string): Observable<any> => this.service.getFilterValues$(this.fullKey, filterKey);
  filterValue$ = (filterIdx: number) => this.service.filterValue$(this.fullKey, filterIdx);

  getEntries(values: { [key: string]: string }): { key: string, value: string }[] {
    const res: { key: string, value: string }[] = [];
    Object.keys(values).forEach(
      (key: string) => res.push({ key, value: values[key] })
    )
    return res;
  }
}
