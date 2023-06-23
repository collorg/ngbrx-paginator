import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Departement } from './departement.model';

export const DepartementActionsPrefix = 'Departement/API';

export const DepartementActions = createActionGroup({
  source: DepartementActionsPrefix,
  events: {
    'Load Departements': props<{ departements: Departement[] }>(),
    'Add Departement': props<{ departement: Departement }>(),
    'Upsert Departement': props<{ departement: Departement }>(),
    'Add Departements': props<{ departements: Departement[] }>(),
    'Upsert Departements': props<{ departements: Departement[] }>(),
    'Update Departement': props<{ departement: Update<Departement> }>(),
    'Update Departements': props<{ departements: Update<Departement>[] }>(),
    'Delete Departement': props<{ id: string }>(),
    'Delete Departements': props<{ ids: string[] }>(),
    'Clear Departements': emptyProps(),

    'Set Page': props<{page: number}>(),
    'Set Page Size': props<{pageSize: number}>(),
    'Filter Collection': props<{ filter: string}>(),
    'Store Filter Query': props<{ filter: string}>(),
    'Set Filtered Collection Size': props<{ size: number}>()
  }
});
