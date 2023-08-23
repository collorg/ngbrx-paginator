import { MemoizedSelector, Selector } from "@ngrx/store";

export interface Pagination {
  page: number;
  pageSize: number;
  filters: string[];
  currentFilter: number;
  activatedFilters: number[];
  filterQueries: string[];
  pageSizeOptions: number[];
}

export const initialPagination: Pagination = {
  page: 1,
  pageSize: 0,
  filters: [],
  currentFilter: -1,
  activatedFilters: [],
  filterQueries: [],
  pageSizeOptions: [5, 10, 25, 100]
}

export interface FilterFunction<D> {
  (items: D[], query: string): D[];
}

export interface FilterFunctions<D> {
  [key: string]: { filter: FilterFunction<D>, values?: MemoizedSelector<object, any> }
}

export interface Paginator<D> {
  allDataSelector: Selector<object, D[]>,
  filters: FilterFunctions<D>,
  pageSizeOptions?: number[]
}

export interface Paginators<D> {
  [key: string]: Paginator<D>
}

export class SPaginators {
  static paginators: Paginators<any> = {};
  constructor() { }

  set paginators(paginators: Paginators<any>) {
    SPaginators.paginators = paginators;
  }

  get paginators(): Paginators<any> {
    return SPaginators.paginators;
  }

}
