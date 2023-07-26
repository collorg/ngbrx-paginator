import { MemoizedSelector, Selector } from "@ngrx/store";

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

export interface Paginators {
  [key: string]: Paginator<any>
}
