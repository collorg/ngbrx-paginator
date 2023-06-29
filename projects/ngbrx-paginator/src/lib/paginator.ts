import { DefaultProjectorFn, MemoizedSelector, State, Store, createAction, createSelector, props } from "@ngrx/store";

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

export function setPage(state: any, { page }: { page: number }): any {
    let pagination = { ...state.pagination };
    pagination.page = page;
    return { ...state, pagination };
}

export function setPageSize(state: any, { pageSize }: { pageSize: number }): any {
    let pagination = { ...state.pagination };
    const oldPageSize = pagination.pageSize;
    const oldPage = pagination.page;
    let newPage = Math.trunc((oldPageSize / pageSize) * oldPage - (oldPageSize / pageSize)) + 1;
    pagination.pageSize = pageSize;
    pagination.page = newPage;
    return { ...state, pagination };
}

export function setFilterQuery(state: any, { filter }: { filter: string }): any {
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

export function selectedPagination<T extends { pagination: Pagination }>(featureSelector: MemoizedSelector<object, T, DefaultProjectorFn<T>>): MemoizedSelector<object, Pagination, (s1: T) => Pagination> {
    return createSelector(
        featureSelector,
        (state: T) => state.pagination
    );
}

export function selectFilterValue<T extends { pagination: Pagination }>(featureSelector: MemoizedSelector<object, T, DefaultProjectorFn<T>>) {
    return createSelector(
        featureSelector,
        (state: T) => state.pagination.filter
    );
}

// export function selectPageItems<M>(collection: MemoizedSelector<object, M[], (s1: M[], s2: string) => M[]>) {
//     return createSelector(
//         collection,
//         selectedPagination,
//         (items: M[], pagination) => {
//             return items.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize)
//         }
//     )
// }
