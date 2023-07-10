import { Selector } from "@ngrx/store";

export interface FilterFunction<D> {
  (items: D[], query: string): D[];
}

export interface Feature<D> {
  allDataSelector: Selector<object, D[]>,
  // filters?: {[key: string]: FilterFunction<D>},
  filters: FilterFunction<D>,
  pageSizeOptions?: number[]
}

export interface PaginatorParams<D> extends Feature<D> {
  key: string,
}

export interface ModuleParams {
  paginators: PaginatorParams<any>[]
}

export interface Features {
  [key: string]: Feature<any>
}

