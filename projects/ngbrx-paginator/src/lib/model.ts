export interface Pagination {
    page: number;
    collectionSize: number;
    pageSize: number;
    pagesCount: number;
}

export const initialPagination: Pagination = {
    page: 1,
    collectionSize: 0,
    pageSize: 100,
    pagesCount: 0,
}
