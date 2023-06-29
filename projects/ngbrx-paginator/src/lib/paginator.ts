import { MemoizedSelector, Store, createAction, props } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, tap } from "rxjs";
import { PaginationActions } from "./pagination.actions";

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
    const pagination = {...state.pagination}
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
