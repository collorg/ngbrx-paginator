import { createActionGroup, props } from '@ngrx/store';

export const NgbrxPaginatorActions = createActionGroup({
  source: 'Pagination/API',
  events: {
    'Init Feature': props<{ key: string, pageSizeOptions?: number[] }>(),
    'Set Page': props<{ key: string, page: number }>(),
    'Set Page Size': props<{ key: string, pageSize: number }>(),
    'Set Page Size Options': props<{ key: string, pageSizeOptions: number[] }>(),
    'Set Filter Query': props<{ key: string, filter: string }>()
  }
});
