import { createActionGroup, props } from '@ngrx/store';
import { Paginator } from '../ngbrx-paginator.model';

export const NgbrxPaginatorActions = createActionGroup({
  source: 'Pagination/API',
  events: {
    'Init Paginator': props<{ key: string, paginator: Paginator<any> }>(),
    'Set Current Paginator': props<{paginatorKey: string}>(),
    'Set Page': props<{ key: string, page: number }>(),
    'Set Page Size': props<{ key: string, pageSize: number }>(),
    'Set Page Size Options': props<{ key: string, pageSizeOptions: number[] }>(),
    'Set Current Filter': props<{key: string, filterKey: string}>(),
    'Select Filter': props<{key: string, filterKey: string}>(),
    'Unselect Filter': props<{key: string, filterKey: string}>(),
    'Set Filter Query': props<{ key: string, filterQuery: string }>()
  }
});
