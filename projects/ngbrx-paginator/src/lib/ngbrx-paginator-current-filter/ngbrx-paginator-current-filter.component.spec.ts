import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbrxPaginatorCurrentFilterComponent } from './ngbrx-paginator-current-filter.component';

describe('NgbrxPaginatorCurrentFilterComponent', () => {
  let component: NgbrxPaginatorCurrentFilterComponent;
  let fixture: ComponentFixture<NgbrxPaginatorCurrentFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgbrxPaginatorCurrentFilterComponent]
    });
    fixture = TestBed.createComponent(NgbrxPaginatorCurrentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
