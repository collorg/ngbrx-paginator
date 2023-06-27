import { createAction, props } from "@ngrx/store";

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

export function setPage(state: any, page: number): any {
    let pagination = { ...state.pagination };
    pagination.page = page;
    return { ...state, pagination };
}

export function setPageSize(state: any, pageSize: number): any {
    let pagination = { ...state.pagination };
    const oldPageSize = pagination.pageSize;
    const oldPage = pagination.page;
    let newPage = Math.trunc((oldPageSize / pageSize) * oldPage - (oldPageSize / pageSize)) + 1;
    pagination.pageSize = pageSize;
    pagination.page = newPage;
    pagination.pagesCount = getPagesCount(pagination);
    return { ...state, pagination };
}

export function setFilterQuery(state: any, filter: string): any {
    return { ...state, filterValue: filter };
}

export function setFilteredCollectionSize(state: any, size: number) {
    let pagination = { ...state.pagination };
    pagination.collectionSize = size;
    pagination.pagesCount = getPagesCount(pagination);
    return { ...state, pagination };
}

export function addPaginationActions(actionsPrefix: string, actionsGroup: any) {
    actionsGroup.setPage = createAction(`[${actionsPrefix}] Set Page`, props<{page: number}>());
    actionsGroup.setPageSize = createAction(`[${actionsPrefix}] Set Page Size`, props<{pageSize: number}>());
    actionsGroup.filterCollection = createAction(`[${actionsPrefix}] Filter Collection`, props<{ filter: string}>());
    actionsGroup.setFilterQuery = createAction(`[${actionsPrefix}] Set Filter Query`, props<{ filter: string}>());
    actionsGroup.setFilteredCollectionSize = createAction(`[${actionsPrefix}] Set Filtered Collection Size`, props<{ size: number}>());
    return actionsGroup;
}
