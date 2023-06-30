import { DefaultProjectorFn, MemoizedSelector, createAction, createSelector, props } from "@ngrx/store";

export interface Pagination {
    page: number;
    pageSize: number;
    filter: string;
}

export const initialPagination: Pagination = {
    page: 1,
    pageSize: 100,
    filter: ''
}

export function setPage<S extends { pagination: Pagination }>(state: S, { page }: { page: number }): S {
    let pagination = { ...state.pagination };
    pagination.page = page;
    return { ...state, pagination };
}

export function setPageSize<S extends { pagination: Pagination }>(state: S, { pageSize }: { pageSize: number }): S {
    let pagination = { ...state.pagination };
    const oldPageSize = pagination.pageSize;
    const oldPage = pagination.page;
    let newPage = Math.trunc((oldPageSize / pageSize) * oldPage - (oldPageSize / pageSize)) + 1;
    pagination.pageSize = pageSize;
    pagination.page = newPage;
    return { ...state, pagination };
}

export function setFilterQuery<S extends { pagination: Pagination }>(state: S, { filter }: { filter: string }): S {
    const pagination = { ...state.pagination }
    pagination.page = 1
    pagination.filter = filter
    return { ...state, pagination };
}

export function createPaginationActions(actionsPrefix: string) {
    return {
        setPage: createAction(`[${actionsPrefix}] Set Page`, props<{ page: number }>()),
        setPageSize: createAction(`[${actionsPrefix}] Set Page Size`, props<{ pageSize: number }>()),
        setFilterQuery: createAction(`[${actionsPrefix}] Set Filter Query`, props<{ filter: string }>()),
    }
}

export function selectedPagination<S extends { pagination: Pagination }>(featureSelector: MemoizedSelector<object, S, DefaultProjectorFn<S>>): MemoizedSelector<object, Pagination, (s1: S) => Pagination> {
    return createSelector(
        featureSelector,
        (state: S) => state.pagination
    );
}

export function selectFilterValue<S extends { pagination: Pagination }>(featureSelector: MemoizedSelector<object, S, DefaultProjectorFn<S>>) {
    return createSelector(
        featureSelector,
        (state: S) => state.pagination.filter
    );
}
