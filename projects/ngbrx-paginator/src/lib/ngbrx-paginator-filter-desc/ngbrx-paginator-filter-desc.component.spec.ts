import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbrxPaginatorFilterDesc } from './ngbrx-paginator-filter-desc.component';

describe('NgbrxPaginatorFilterDesc', () => {
  let component: NgbrxPaginatorFilterDesc;
  let fixture: ComponentFixture<NgbrxPaginatorFilterDesc>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgbrxPaginatorFilterDesc]
    });
    fixture = TestBed.createComponent(NgbrxPaginatorFilterDesc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
