import { MemoizedSelector, Store, createAction, props } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, tap } from "rxjs";
import { PaginationActions } from "./pagination.actions";

export interface Pagination {
    page: number;
    collectionSize: number;
    pageSize: number;
    pagesCount: number;
    filter: string;
}

export const initialPagination: Pagination = {
    page: 1,
    collectionSize: 0,
    pageSize: 100,
    pagesCount: 0,
    filter: ''
}

export function getPagesCount(pagination: Pagination): number {
    return Math.floor(pagination.collectionSize / pagination.pageSize) + 1;
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
    pagination.pagesCount = getPagesCount(pagination);
    return { ...state, pagination };
}

export function setFilterQuery(state: any, { filter }: { filter: string }): any {
    return { ...state, filterValue: filter };
}

export function setFilteredCollectionSize(state: any, { size }: { size: number }) {
    let pagination = { ...state.pagination };
    pagination.collectionSize = size;
    pagination.pagesCount = getPagesCount(pagination);
    return { ...state, pagination };
}

export function createPaginationActions(actionsPrefix: string) {
    return {
        setPage: createAction(`[${actionsPrefix}] Set Page`, props<{ page: number }>()),
        setPageSize: createAction(`[${actionsPrefix}] Set Page Size`, props<{ pageSize: number }>()),
        filterCollection: createAction(`[${actionsPrefix}] Filter Collection`, props<{ filter: string }>()),
        setFilterQuery: createAction(`[${actionsPrefix}] Set Filter Query`, props<{ filter: string }>()),
        setFilteredCollectionSize: createAction(`[${actionsPrefix}] Set Filtered Collection Size`, props<{ size: number }>())
    }
}

export function createFilterEffect<T>(actions$: Actions, store: Store, actions: PaginationActions, filterSelector: MemoizedSelector<{}, T[]>) {
    return createEffect(() =>
        actions$.pipe(
        ofType(actions.filterCollection),
        tap((action) => {
            store.dispatch(actions.setFilterQuery({ filter: action.filter }));
            store.dispatch(actions.setPage({ page: 1 }));
        }),
        switchMap(() => store.select(filterSelector)),
        tap((collection: T[]) => {
            store.dispatch(actions.setFilteredCollectionSize({ size: collection.length }));
            return [];
        })
        ), { dispatch: false }
    );
}
