import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { NgbrxPaginatorComponent } from './ngbrx-paginator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Selector, Store, StoreModule } from '@ngrx/store';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import * as fromPaginationState from './reducers';
import { NgbrxPaginatorActions } from './reducers/ngbrx-paginator.actions';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgbrxPaginatorService } from './ngbrx-paginator.service';

interface ModuleParams {
  featureKey?: string,
  filterFunction?: any,
  allDataSelector: Selector<object, any[]>,
  pageSizeOptions?: number[]
}

let features: ModuleParams[] = [];
const featuresSubject: BehaviorSubject<ModuleParams[]> = new BehaviorSubject<ModuleParams[]>(features);
const features$: Observable<ModuleParams[]> = featuresSubject.asObservable();

@NgModule({
  declarations: [
    NgbrxPaginatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    StoreModule.forFeature(fromPaginationState.paginationStateFeatureKey, fromPaginationState.reducers)
  ],
  exports: [
    NgbrxPaginatorComponent
  ]
})
export class NgbrxPaginatorModule {
  static forRoot(): ModuleWithProviders<NgbrxPaginatorModule> {
    return {
      ngModule: NgbrxPaginatorModule,
    };
  }

  static forFeature(options: ModuleParams): ModuleWithProviders<NgbrxPaginatorModule> {
    features.push(options);
    featuresSubject.next(features);
    return {
      ngModule: NgbrxPaginatorModule,
      providers: [
        { provide: 'FEATURE_KEY', useValue: options.featureKey },
        { provide: 'ALL_DATA_SELECTOR', useValue: options.allDataSelector },
        { provide: 'FILTER_FUNCTION', useValue: options?.filterFunction },
        { provide: 'PAGE_SIZE_OPTIONS', useValue: options?.pageSizeOptions },
      ]
    };
  }

  constructor(
    private store: Store,
    @Optional() @Inject('FEATURE_KEY') private featureKey: string,
    @Optional() @Inject('ALL_DATA_SELECTOR') private allDataSelector: Function,
    @Optional() @Inject('FILTER_FUNCTION') private filterFunction?: any,
    @Optional() @Inject('PAGE_SIZE_OPTIONS') private pageSizeOptions?: any,
  ) {
    features$.subscribe(
      (features) => {
        features.forEach((feature: ModuleParams) => {
          if (feature.featureKey) {
            this.addFeature(feature)
          }
        })
      }
    )

  }

  addFeature(feature: ModuleParams) {
    if (feature.featureKey) {
      this.store.dispatch(NgbrxPaginatorActions.initFeature({ featureKey: feature.featureKey, pageSizeOptions: feature.pageSizeOptions }));
      if (feature.filterFunction) {
        NgbrxPaginatorService.add(feature.featureKey, feature.filterFunction, feature.allDataSelector);
      }
    }
  }


}
