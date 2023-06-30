import { Pagination } from "ngbrx-paginator";

export interface PaginationActions {
  setPage: <S extends { pagination: Pagination }>(state: S, { page }: { page: number }) => S;
  setPageSize: <S extends { pagination: Pagination }>(state: S, { pageSize }: { pageSize: number }) => S;
  setFilterQuery: <S extends { pagination: Pagination }>(state: S, { filter }: { filter: string }) => S;
}
