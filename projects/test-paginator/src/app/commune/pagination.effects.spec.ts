import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { PaginationEffects } from './pagination.effects';

describe('PaginationEffects', () => {
  let actions$: Observable<any>;
  let effects: PaginationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaginationEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(PaginationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
