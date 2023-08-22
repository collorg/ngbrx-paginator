import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbrxPaginatorFilterSelectorComponent } from './ngbrx-paginator-filter-selector.component';

describe('NgbrxPaginatorFilterSelectorComponent', () => {
  let component: NgbrxPaginatorFilterSelectorComponent;
  let fixture: ComponentFixture<NgbrxPaginatorFilterSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgbrxPaginatorFilterSelectorComponent]
    });
    fixture = TestBed.createComponent(NgbrxPaginatorFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
