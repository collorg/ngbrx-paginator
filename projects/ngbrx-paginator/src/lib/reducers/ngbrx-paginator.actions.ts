import { createActionGroup, props } from '@ngrx/store';
import { Paginator } from '../ngbrx-paginator.model';

export const NgbrxPaginatorActions = createActionGroup({
  source: 'Pagination/API',
  events: {
    'Set Paginator': props<{ key: string, paginator: Paginator<any> }>(),
    'Set Page': props<{ key: string, page: number }>(),
    'Set Page Size': props<{ key: string, pageSize: number }>(),
    'Set Page Size Options': props<{ key: string, pageSizeOptions: number[] }>(),
    'Set Current Filter': props<{key: string, filterIdx: number}>(),
    'Set Filter Query': props<{ key: string, value?: string, filterQuery: string }>(),
    'Toggle Activated Filter': props<{key: string, filterIdx: number}>(),
  }
});
