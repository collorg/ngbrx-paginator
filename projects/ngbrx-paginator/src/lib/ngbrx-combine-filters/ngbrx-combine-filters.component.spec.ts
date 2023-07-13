import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbrxCombineFiltersComponent } from './ngbrx-combine-filters.component';

describe('NgbrxCombineFiltersComponent', () => {
  let component: NgbrxCombineFiltersComponent;
  let fixture: ComponentFixture<NgbrxCombineFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgbrxCombineFiltersComponent]
    });
    fixture = TestBed.createComponent(NgbrxCombineFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
