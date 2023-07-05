import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Commune } from './commune.model';

export const CommuneActionsPrefix = 'Commune/API';

export const CommuneActions = createActionGroup({
  source: CommuneActionsPrefix,
  events: {
    'Load Communes': props<{ communes: Commune[] }>(),
    'Add Commune': props<{ commune: Commune }>(),
    'Upsert Commune': props<{ commune: Commune }>(),
    'Add Communes': props<{ communes: Commune[] }>(),
    'Upsert Communes': props<{ communes: Commune[] }>(),
    'Update Commune': props<{ commune: Update<Commune> }>(),
    'Update Communes': props<{ communes: Update<Commune>[] }>(),
    'Delete Commune': props<{ id: string }>(),
    'Delete Communes': props<{ ids: string[] }>(),
    'Clear Communes': emptyProps(),
  }
});
