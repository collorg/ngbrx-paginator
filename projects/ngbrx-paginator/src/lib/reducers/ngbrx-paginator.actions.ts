import { createActionGroup, props } from '@ngrx/store';

export const NgbrxPaginatorActions = createActionGroup({
  source: 'Pagination/API',
  events: {
    'Init Feature': props<{ featureKey: string, pageSizeOptions?: number[] }>(),
    'Set Page': props<{ featureKey: string, page: number }>(),
    'Set Page Size': props<{ featureKey: string, pageSize: number }>(),
    'Set Filter Query': props<{ featureKey: string, filter: string }>()
  }
});
