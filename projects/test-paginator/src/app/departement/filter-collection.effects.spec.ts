import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { FilterCollectionEffects } from './filter-collection.effects';

describe('FilterCollectionEffects', () => {
  let actions$: Observable<any>;
  let effects: FilterCollectionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilterCollectionEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(FilterCollectionEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
